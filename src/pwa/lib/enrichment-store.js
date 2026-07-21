import { writable } from 'svelte/store';
import { enrichmentApi } from './enrichment-api.js';

const POLL_MAX_FETCHES = 120;
const POLL_INITIAL_DELAY_MS = 2500;
const POLL_MAX_DELAY_MS = 20000;
const POLL_MAX_DURATION_MS = 5 * 60 * 1000;
const POLL_HIDDEN_WAIT_MS = 2500;
const MAX_CONCURRENT = 3;

const TERMINAL_STATUSES = new Set(['ready', 'failed', 'applied', 'dismissed']);

export function pollBackoffMs(completedFetches) {
  if (completedFetches <= 0) return 0;
  return Math.min(POLL_INITIAL_DELAY_MS * Math.pow(2, completedFetches - 1), POLL_MAX_DELAY_MS);
}

export function pollMaxDurationMs() {
  return POLL_MAX_DURATION_MS;
}

export function pollMaxFetches() {
  return POLL_MAX_FETCHES;
}

export function maxConcurrent() {
  return MAX_CONCURRENT;
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

function createInitialState(companyId) {
  return {
    companyId,
    status: 'idle',
    serverStatus: null,
    enrichmentId: null,
    result: null,
    error: null,
    pollCount: 0,
    pollStartedAt: null,
    pollRunId: 0,
    companyName: null,
    website: null,
    appliedCount: null,
    reviewedAction: null,
  };
}

const PERSIST_KEY = 'tl_enrichment_states';
const PERSISTABLE_STATUSES = new Set(['ready', 'applied', 'failed', 'reviewed']);

function persistStates() {
  try {
    const toSave = {};
    for (const [id, state] of Object.entries(_states)) {
      if (PERSISTABLE_STATUSES.has(state.status)) {
        toSave[id] = {
          companyId: state.companyId,
          status: state.status,
          serverStatus: state.serverStatus,
          enrichmentId: state.enrichmentId,
          result: state.result,
          error: state.error,
          companyName: state.companyName,
          website: state.website,
          appliedCount: state.appliedCount,
          reviewedAction: state.reviewedAction,
        };
      }
    }
    localStorage.setItem(PERSIST_KEY, JSON.stringify(toSave));
  } catch {}
}

function loadPersistedStates() {
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    for (const [id, state] of Object.entries(saved)) {
      if (state && PERSISTABLE_STATUSES.has(state.status)) {
        _states[id] = { ...createInitialState(Number(id)), ...state };
      }
    }
  } catch {}
}

const _states = {};
const _subscribers = new Set();
let _pollRunIdCounter = 0;
let _api = enrichmentApi;

loadPersistedStates();

function notify() {
  _subscribers.forEach((fn) => fn(_states));
}

function setState(companyId, patch) {
  if (!_states[companyId]) _states[companyId] = createInitialState(companyId);
  Object.assign(_states[companyId], patch);
  notify();
  persistStates();
}

function activeCount() {
  return Object.values(_states).filter((s) =>
    s.status === 'triggering' || s.status === 'polling'
  ).length;
}

function processQueue() {
  const queued = Object.values(_states).filter((s) => s.status === 'queued');
  for (const s of queued) {
    if (activeCount() >= MAX_CONCURRENT) break;
    startEnrichment(s.companyId, s.companyName, s.website);
  }
}

async function startEnrichment(companyId, companyName, website) {
  setState(companyId, { status: 'triggering', error: null, result: null });

  try {
    const payload = await _api.queueEnrichment(companyId, 'user');

    if (!_states[companyId]) {
      processQueue();
      return;
    }

    if (!payload) {
      setState(companyId, { status: 'failed', error: 'No response from server' });
      processQueue();
      return;
    }

    const serverStatus = payload.status;
    setState(companyId, {
      serverStatus,
      enrichmentId: payload.id,
    });

    if (serverStatus === 'ready') {
      setState(companyId, {
        status: 'ready',
        result: payload.result,
      });
      processQueue();
    } else if (serverStatus === 'failed') {
      setState(companyId, {
        status: 'failed',
        error: payload.error_message ?? 'Enrichment failed',
      });
      processQueue();
    } else if (TERMINAL_STATUSES.has(serverStatus)) {
      setState(companyId, { status: 'idle' });
      processQueue();
    } else {
      setState(companyId, { status: 'polling', pollStartedAt: Date.now(), pollCount: 0 });
      startPolling(companyId);
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Could not start enrichment';
    console.error('[enrichment] trigger failed for', companyId, ':', msg, e);
    setState(companyId, {
      status: 'failed',
      error: msg,
    });
    processQueue();
  }
}

async function startPolling(companyId) {
  const runId = ++_pollRunIdCounter;
  const state = _states[companyId];
  if (!state) return;

  setState(companyId, { pollRunId: runId });

  while (true) {
    const current = _states[companyId];
    if (!current || current.pollRunId !== runId) return;
    if (current.status !== 'polling') return;

    await waitWhileHidden();

    const checkState = _states[companyId];
    if (!checkState || checkState.pollRunId !== runId) return;
    if (checkState.status !== 'polling') return;

    try {
      const payload = await _api.fetchEnrichmentLatest(companyId);
      const s = _states[companyId];
      if (!s || s.pollRunId !== runId) return;
      if (s.status !== 'polling') return;

      if (!payload) {
        setState(companyId, {
          status: 'failed',
          error: 'Enrichment disappeared from server',
        });
        processQueue();
        return;
      }

      const serverStatus = payload.status;
      setState(companyId, {
        serverStatus,
        enrichmentId: payload.id ?? s.enrichmentId,
      });

      if (serverStatus === 'ready') {
        setState(companyId, {
          status: 'ready',
          result: payload.result,
        });
        processQueue();
        return;
      }

      if (serverStatus === 'failed') {
        setState(companyId, {
          status: 'failed',
          error: payload.error_message ?? 'Enrichment failed',
        });
        processQueue();
        return;
      }

      if (TERMINAL_STATUSES.has(serverStatus)) {
        setState(companyId, { status: 'idle' });
        processQueue();
        return;
      }

      const newCount = s.pollCount + 1;
      const elapsed = Date.now() - s.pollStartedAt;

      if (newCount >= POLL_MAX_FETCHES) {
        setState(companyId, {
          status: 'failed',
          error: 'Enrichment is taking longer than expected. Try again later.',
          pollCount: newCount,
        });
        processQueue();
        return;
      }

      if (elapsed >= POLL_MAX_DURATION_MS) {
        setState(companyId, {
          status: 'failed',
          error: 'Enrichment timed out after 5 minutes. Try again later.',
          pollCount: newCount,
        });
        processQueue();
        return;
      }

      setState(companyId, { pollCount: newCount });

      const delay = pollBackoffMs(newCount);
      if (document?.visibilityState === 'hidden') {
        await sleep(POLL_HIDDEN_WAIT_MS);
      } else {
        await sleep(delay);
      }
    } catch (e) {
      const s = _states[companyId];
      if (!s || s.pollRunId !== runId) return;
      if (s.status !== 'polling') return;

      setState(companyId, {
        status: 'failed',
        error: e instanceof Error ? e.message : 'Connection lost during enrichment',
      });
      processQueue();
      return;
    }
  }
}

export function setEnrichmentApi(api) {
  _api = api;
}

export function resetEnrichmentStore() {
  for (const key of Object.keys(_states)) {
    delete _states[key];
  }
  _pollRunIdCounter = 0;
  notify();
}

export const enrichmentStore = {
  subscribe(fn) {
    _subscribers.add(fn);
    fn(_states);
    return () => _subscribers.delete(fn);
  },

  trigger(companyId, companyName, website) {
    if (!website) {
      setState(companyId, {
        status: 'failed',
        error: 'This firm has no website on file. Enrichment requires a website.',
      });
      return;
    }

    const existing = _states[companyId];
    if (existing && (existing.status === 'triggering' || existing.status === 'polling')) {
      return;
    }

    setState(companyId, {
      status: activeCount() >= MAX_CONCURRENT ? 'queued' : 'idle',
      companyName,
      website,
      serverStatus: null,
      enrichmentId: null,
      result: null,
      error: null,
      pollCount: 0,
      pollStartedAt: null,
    });

    if (activeCount() < MAX_CONCURRENT) {
      startEnrichment(companyId, companyName, website);
    }
  },

  stopPolling(companyId) {
    const state = _states[companyId];
    if (state) {
      setState(companyId, { pollRunId: ++_pollRunIdCounter, status: 'idle' });
      processQueue();
    }
  },

  async apply(companyId, selections) {
    const state = _states[companyId];
    if (!state || !state.enrichmentId || !state.result) return;

    setState(companyId, { status: 'applying' });

    try {
      const payload = buildApplyPayload(state.result, selections);
      await _api.applyEnrichment(companyId, state.enrichmentId, payload);
      setState(companyId, { status: 'applied', appliedCount: countSelected(selections) });
    } catch (e) {
      setState(companyId, {
        status: 'failed',
        error: e instanceof Error ? e.message : 'Failed to apply suggestions',
      });
    }
  },

  async dismiss(companyId) {
    const state = _states[companyId];
    if (!state || !state.enrichmentId) return;

    try {
      await _api.dismissEnrichment(companyId, state.enrichmentId);
    } catch {
    } finally {
      setState(companyId, { status: 'reviewed', reviewedAction: 'dismissed' });
    }
  },

  markReviewed(companyId, action = 'reviewed') {
    setState(companyId, { status: 'reviewed', reviewedAction: action });
  },

  retry(companyId) {
    const state = _states[companyId];
    if (!state) return;
    setState(companyId, {
      status: 'idle',
      serverStatus: null,
      enrichmentId: null,
      result: null,
      error: null,
      pollCount: 0,
      pollStartedAt: null,
    });
    this.trigger(companyId, state.companyName, state.website);
  },

  clear(companyId) {
    if (_states[companyId]) {
      _states[companyId].pollRunId = ++_pollRunIdCounter;
      delete _states[companyId];
    }
    notify();
    persistStates();
    processQueue();
  },

  getState(companyId) {
    return _states[companyId] ?? null;
  },
};

export function buildApplyPayload(result, selections) {
  if (!result) return {};
  const payload = {};

  if (selections?.suggestionKeys?.size && Array.isArray(result.suggestions)) {
    payload.suggestions = result.suggestions.filter((_, i) =>
      selections.suggestionKeys.has(`suggestions:${i}`)
    );
  }

  if (selections?.projects?.size && Array.isArray(result.keyProjects)) {
    payload.keyProjects = result.keyProjects.filter((_, i) =>
      selections.projects.has(i)
    );
  }

  if (selections?.contacts?.size && Array.isArray(result.contacts)) {
    payload.contacts = result.contacts.filter((_, i) =>
      selections.contacts.has(i)
    );
  }

  if (selections?.addresses?.size && Array.isArray(result.addresses)) {
    payload.addresses = result.addresses.filter((_, i) =>
      selections.addresses.has(i)
    );
  }

  return payload;
}

export const ENRICHMENT_STATUS_LABELS = {
  queued: 'Queued...',
  scraping: 'Reading website...',
  scraped: 'Website read...',
  processing: 'Analyzing profile...',
  pending_decision: 'Finalizing...',
  ready: 'Ready to review',
  failed: 'Failed',
  applied: 'Applied',
  dismissed: 'Dismissed',
};

export function statusLabel(serverStatus) {
  return ENRICHMENT_STATUS_LABELS[serverStatus] ?? serverStatus ?? '—';
}

export function defaultSelections(result) {
  if (!result) return { suggestionKeys: new Set(), projects: new Set(), contacts: new Set(), addresses: new Set() };

  const isSelectable = (s) => s?.confidence === 'high' || s?.confidence === 'medium';

  const suggestionKeys = new Set();
  if (Array.isArray(result.suggestions)) {
    result.suggestions.forEach((s, i) => {
      if (isSelectable(s)) suggestionKeys.add(`suggestions:${i}`);
    });
  }

  const projects = new Set();
  if (Array.isArray(result.keyProjects)) {
    result.keyProjects.forEach((s, i) => {
      if (isSelectable(s)) projects.add(i);
    });
  }

  const contacts = new Set();
  if (Array.isArray(result.contacts)) {
    result.contacts.forEach((s, i) => {
      if (isSelectable(s)) contacts.add(i);
    });
  }

  const addresses = new Set();
  if (Array.isArray(result.addresses)) {
    result.addresses.forEach((s, i) => {
      if (isSelectable(s)) addresses.add(i);
    });
  }

  return { suggestionKeys, projects, contacts, addresses };
}

export function countSelected(selections) {
  if (!selections) return 0;
  return (selections.suggestionKeys?.size ?? 0) +
    (selections.projects?.size ?? 0) +
    (selections.contacts?.size ?? 0) +
    (selections.addresses?.size ?? 0);
}
