import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('./sam-api.js', () => ({
  samApi: {
    listAgents: vi.fn(),
    getAgent: vi.fn(),
    findSamAgent: vi.fn(),
    createRun: vi.fn(),
    listRuns: vi.fn(),
    getRun: vi.fn(),
    getRunLogs: vi.fn(),
  },
}));

import {
  pollIntervalMs,
  pollMaxDurationMs,
  runStatusLabel,
  runStatusTone,
  runDurationLabel,
  formatJson,
  MESSAGE_ROLE_LABELS,
  LOG_TYPE_LABELS,
} from './sam-store.js';

describe('polling constants', () => {
  it('polls every 3 seconds', () => {
    expect(pollIntervalMs()).toBe(3000);
  });

  it('max duration is 10 minutes', () => {
    expect(pollMaxDurationMs()).toBe(10 * 60 * 1000);
  });
});

describe('runStatusLabel', () => {
  it('maps all statuses to labels', () => {
    expect(runStatusLabel('queued')).toBe('Queued');
    expect(runStatusLabel('running')).toBe('Running');
    expect(runStatusLabel('completed')).toBe('Completed');
    expect(runStatusLabel('failed')).toBe('Failed');
    expect(runStatusLabel('cancelled')).toBe('Cancelled');
  });

  it('returns raw value for unknown', () => {
    expect(runStatusLabel('unknown')).toBe('unknown');
  });

  it('returns dash for null', () => {
    expect(runStatusLabel(null)).toBe('—');
  });
});

describe('runStatusTone', () => {
  it('returns success for completed', () => {
    expect(runStatusTone('completed')).toBe('success');
  });

  it('returns error for failed', () => {
    expect(runStatusTone('failed')).toBe('error');
  });

  it('returns info for running', () => {
    expect(runStatusTone('running')).toBe('info');
  });

  it('returns muted for queued', () => {
    expect(runStatusTone('queued')).toBe('muted');
  });
});

describe('runDurationLabel', () => {
  it('formats seconds', () => {
    const run = { started_at: new Date(Date.now() - 30000).toISOString() };
    expect(runDurationLabel(run)).toMatch(/\d+s/);
  });

  it('formats minutes and seconds', () => {
    const run = {
      started_at: new Date(Date.now() - 125000).toISOString(),
      completed_at: new Date().toISOString(),
    };
    expect(runDurationLabel(run)).toBe('2m 5s');
  });

  it('returns dash for no start time', () => {
    expect(runDurationLabel({})).toBe('—');
  });
});

describe('formatJson', () => {
  it('formats JSON objects', () => {
    const result = formatJson({ a: 1, b: 2 });
    expect(result).toBe('{\n  "a": 1,\n  "b": 2\n}');
  });

  it('parses and formats JSON strings', () => {
    const result = formatJson('{"a":1}');
    expect(result).toBe('{\n  "a": 1\n}');
  });

  it('returns non-JSON strings as-is', () => {
    expect(formatJson('hello')).toBe('hello');
  });

  it('returns empty for null', () => {
    expect(formatJson(null)).toBe('');
  });
});

describe('label maps', () => {
  it('has message role labels', () => {
    expect(MESSAGE_ROLE_LABELS.system).toBe('System');
    expect(MESSAGE_ROLE_LABELS.user).toBe('User');
    expect(MESSAGE_ROLE_LABELS.assistant).toBe('Assistant');
    expect(MESSAGE_ROLE_LABELS.tool).toBe('Tool');
  });

  it('has log type labels', () => {
    expect(LOG_TYPE_LABELS.agent_started).toBe('Agent Started');
    expect(LOG_TYPE_LABELS.prompt).toBe('Prompt');
    expect(LOG_TYPE_LABELS.output).toBe('Output');
    expect(LOG_TYPE_LABELS.error).toBe('Error');
    expect(LOG_TYPE_LABELS.agent_completed).toBe('Agent Completed');
  });
});
