import { writable } from 'svelte/store';
import { samApi } from './sam-api.js';

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_DURATION_MS = 10 * 60 * 1000;

const ACTIVE_STATUSES = new Set(['queued', 'running']);

export function pollIntervalMs() {
  return POLL_INTERVAL_MS;
}

export function pollMaxDurationMs() {
  return POLL_MAX_DURATION_MS;
}

function waitWhileHidden() {
  return new Promise((resolve) => {
    if (typeof document === 'undefined' || document.visibilityState !== 'hidden') {
      resolve();
      return;
    }
    const handler = () => {
      if (document.visibilityState === 'visible') {
        document.removeEventListener('visibilitychange', handler);
        resolve();
      }
    };
    document.addEventListener('visibilitychange', handler);
  });
}

function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(new Error('aborted')); return; }
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('aborted'));
    }, { once: true });
  });
}

const _state = {
  samAgent: null,
  runs: [],
  currentRun: null,
  currentLogs: [],
  loading: false,
  error: null,
  polling: false,
};

const _subscribers = new Set();
let _pollRunId = 0;
let _pollStartedAt = null;
let _api = samApi;

function notify() {
  _subscribers.forEach((fn) => fn(_state));
}

function setState(patch) {
  Object.assign(_state, patch);
  notify();
}

async function loadSamAgent() {
  if (_state.samAgent) return _state.samAgent;
  try {
    const agent = await _api.findSamAgent();
    if (agent) setState({ samAgent: agent });
    return agent;
  } catch (e) {
    setState({ error: e instanceof Error ? e.message : 'Failed to find SAM agent' });
    return null;
  }
}

export function setSamApi(api) {
  _api = api;
}

export function resetSamStore() {
  if (_pollRunId) _pollRunId++;
  Object.assign(_state, {
    samAgent: null,
    runs: [],
    currentRun: null,
    currentLogs: [],
    loading: false,
    error: null,
    polling: false,
  });
  _pollStartedAt = null;
  notify();
}

export async function loadRuns() {
  const agent = await loadSamAgent();
  if (!agent) return;
  setState({ loading: true });
  try {
    const runs = await _api.listRuns(agent.id);
    setState({ runs, loading: false });
  } catch (e) {
    setState({ loading: false, error: e instanceof Error ? e.message : 'Failed to load runs' });
  }
}

export async function triggerRun(project) {
  const agent = await loadSamAgent();
  if (!agent) {
    setState({ error: 'SAM agent not found or not enabled' });
    return null;
  }

  const input = {
    project_id: project?.id,
    project_name: project?.name,
  };

  try {
    setState({ error: null });
    const run = await _api.createRun(agent.id, input);
    setState({ currentRun: run, currentLogs: [] });
    if (ACTIVE_STATUSES.has(run?.status)) {
      startPolling(run.id);
    }
    await loadRuns();
    return run;
  } catch (e) {
    setState({ error: e instanceof Error ? e.message : 'Failed to trigger SAM run' });
    return null;
  }
}

export async function viewRun(runId) {
  setState({ currentRun: null, currentLogs: [], error: null });
  try {
    const run = await _api.getRun(runId);
    setState({ currentRun: run });
    try {
      const logs = await _api.getRunLogs(runId);
      setState({ currentLogs: logs });
    } catch {}
    if (run && ACTIVE_STATUSES.has(run.status)) {
      startPolling(runId);
    }
  } catch (e) {
    setState({ error: e instanceof Error ? e.message : 'Failed to load run' });
  }
}

async function startPolling(runId) {
  const runId0 = ++_pollRunId;
  _pollStartedAt = Date.now();
  setState({ polling: true });

  while (true) {
    if (_pollRunId !== runId0) return;
    await waitWhileHidden();
    if (_pollRunId !== runId0) return;

    try {
      const run = await _api.getRun(runId);
      if (_pollRunId !== runId0) return;

      setState({ currentRun: run });

      try {
        const logs = await _api.getRunLogs(runId);
        if (_pollRunId !== runId0) return;
        setState({ currentLogs: logs });
      } catch {}

      if (!ACTIVE_STATUSES.has(run?.status)) {
        setState({ polling: false });
        await loadRuns();
        return;
      }

      const elapsed = Date.now() - _pollStartedAt;
      if (elapsed >= POLL_MAX_DURATION_MS) {
        setState({ polling: false, error: 'SAM run is taking longer than 10 minutes. Check back later.' });
        return;
      }

      await sleep(POLL_INTERVAL_MS);
      if (_pollRunId !== runId0) return;
    } catch (e) {
      if (_pollRunId !== runId0) return;
      setState({ polling: false, error: e instanceof Error ? e.message : 'Connection lost during polling' });
      return;
    }
  }
}

export function stopPolling() {
  _pollRunId++;
  setState({ polling: false });
}

export function clearCurrentRun() {
  _pollRunId++;
  setState({ currentRun: null, currentLogs: [], polling: false });
}

export const samStore = {
  subscribe(fn) {
    _subscribers.add(fn);
    fn(_state);
    return () => _subscribers.delete(fn);
  },
  triggerRun,
  loadRuns,
  viewRun,
  stopPolling,
  clearCurrentRun,
  get state() { return _state; },
};

export const RUN_STATUS_LABELS = {
  queued: 'Queued',
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
  cancelled: 'Cancelled',
};

export function runStatusLabel(status) {
  return RUN_STATUS_LABELS[status] ?? status ?? '—';
}

export function runStatusTone(status) {
  if (status === 'completed') return 'success';
  if (status === 'failed') return 'error';
  if (status === 'running') return 'info';
  if (status === 'queued') return 'muted';
  return 'muted';
}

export function runDurationLabel(run) {
  if (!run?.started_at) return '—';
  const start = new Date(run.started_at).getTime();
  const end = run.completed_at ? new Date(run.completed_at).getTime() : Date.now();
  const secs = Math.round((end - start) / 1000);
  if (secs < 60) return `${secs}s`;
  return `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

export function formatJson(value) {
  if (value == null) return '';
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export const MESSAGE_ROLE_LABELS = {
  system: 'System',
  user: 'User',
  assistant: 'Assistant',
  tool: 'Tool',
};

export const LOG_TYPE_LABELS = {
  agent_started: 'Agent Started',
  prompt: 'Prompt',
  output: 'Output',
  error: 'Error',
  agent_completed: 'Agent Completed',
};
