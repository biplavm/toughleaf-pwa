import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('./enrichment-api.js', () => ({
  enrichmentApi: {
    queueEnrichment: vi.fn(),
    fetchEnrichmentLatest: vi.fn(),
    applyEnrichment: vi.fn(),
    dismissEnrichment: vi.fn(),
  },
}));

import {
  pollBackoffMs,
  pollMaxFetches,
  pollMaxDurationMs,
  maxConcurrent,
  enrichmentStore,
  setEnrichmentApi,
  resetEnrichmentStore,
  buildApplyPayload,
  defaultSelections,
  countSelected,
  statusLabel,
  ENRICHMENT_STATUS_LABELS,
} from './enrichment-store.js';

function makeSuggestion(field, confidence, currentValue = null, suggestedValue = 'new') {
  return { field, label: field, currentValue, suggestedValue, confidence, source: 'website' };
}

function makeResult(overrides = {}) {
  return {
    companyId: 1,
    companyName: 'Test Co',
    sourceUrl: 'https://example.com',
    suggestions: [
      makeSuggestion('email', 'high', null, 'info@test.com'),
      makeSuggestion('phone', 'medium', null, '555-1234'),
      makeSuggestion('about', 'low', null, 'A company'),
    ],
    keyProjects: [
      makeSuggestion('project1', 'high', null, { name: 'City Hall', value: '$2.5M' }),
      makeSuggestion('project2', 'low', null, { name: 'Bridge', value: '$1M' }),
    ],
    contacts: [
      makeSuggestion('contact1', 'medium', null, { name: 'John', email: 'john@test.com' }),
    ],
    addresses: [
      makeSuggestion('address1', 'low', null, { street: '123 Main St' }),
    ],
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

function makeReadyPayload(result) {
  return { id: 100, status: 'ready', trigger: 'user', error_message: null, completed_at: null, created_at: null, result };
}

function makeProcessingPayload() {
  return { id: 100, status: 'processing', trigger: 'user', error_message: null, completed_at: null, created_at: null, result: null };
}

function makeFailedPayload(msg = 'Scraper failed') {
  return { id: 100, status: 'failed', trigger: 'user', error_message: msg, completed_at: null, created_at: null, result: null };
}

function createMockApi(overrides = {}) {
  const calls = { queue: [], poll: [], apply: [], dismiss: [] };
  const api = {
    queueEnrichment: overrides.queueEnrichment ?? vi.fn(async () => makeProcessingPayload()),
    fetchEnrichmentLatest: overrides.fetchEnrichmentLatest ?? vi.fn(async () => makeReadyPayload(makeResult())),
    applyEnrichment: overrides.applyEnrichment ?? vi.fn(async () => {}),
    dismissEnrichment: overrides.dismissEnrichment ?? vi.fn(async () => {}),
    calls,
  };
  const origQueue = api.queueEnrichment;
  api.queueEnrichment = (...args) => { calls.queue.push(args); return origQueue(...args); };
  const origPoll = api.fetchEnrichmentLatest;
  api.fetchEnrichmentLatest = (...args) => { calls.poll.push(args); return origPoll(...args); };
  const origApply = api.applyEnrichment;
  api.applyEnrichment = (...args) => { calls.apply.push(args); return origApply(...args); };
  const origDismiss = api.dismissEnrichment;
  api.dismissEnrichment = (...args) => { calls.dismiss.push(args); return origDismiss(...args); };
  return api;
}

describe('pollBackoffMs', () => {
  it('returns 0 for first fetch (immediate)', () => {
    expect(pollBackoffMs(0)).toBe(0);
  });

  it('produces correct exponential backoff schedule', () => {
    expect(pollBackoffMs(1)).toBe(2500);
    expect(pollBackoffMs(2)).toBe(5000);
    expect(pollBackoffMs(3)).toBe(10000);
    expect(pollBackoffMs(4)).toBe(20000);
  });

  it('caps at max delay', () => {
    expect(pollBackoffMs(5)).toBe(20000);
    expect(pollBackoffMs(10)).toBe(20000);
    expect(pollBackoffMs(100)).toBe(20000);
  });
});

describe('polling constants', () => {
  it('exposes max fetches', () => {
    expect(pollMaxFetches()).toBe(120);
  });

  it('exposes max duration', () => {
    expect(pollMaxDurationMs()).toBe(5 * 60 * 1000);
  });

  it('exposes max concurrent', () => {
    expect(maxConcurrent()).toBe(3);
  });
});

describe('statusLabel', () => {
  it('maps all server statuses to mobile-optimized labels', () => {
    expect(statusLabel('queued')).toBe('Queued...');
    expect(statusLabel('scraping')).toBe('Reading website...');
    expect(statusLabel('scraped')).toBe('Website read...');
    expect(statusLabel('processing')).toBe('Analyzing profile...');
    expect(statusLabel('pending_decision')).toBe('Finalizing...');
    expect(statusLabel('ready')).toBe('Ready to review');
    expect(statusLabel('failed')).toBe('Failed');
    expect(statusLabel('applied')).toBe('Applied');
    expect(statusLabel('dismissed')).toBe('Dismissed');
  });

  it('returns raw status for unknown values', () => {
    expect(statusLabel('unknown')).toBe('unknown');
  });

  it('returns dash for null', () => {
    expect(statusLabel(null)).toBe('—');
  });
});

describe('defaultSelections', () => {
  it('selects only high and medium confidence suggestions', () => {
    const result = makeResult();
    const sel = defaultSelections(result);
    expect(sel.suggestionKeys.size).toBe(2);
    expect(sel.suggestionKeys.has('suggestions:0')).toBe(true);
    expect(sel.suggestionKeys.has('suggestions:1')).toBe(true);
    expect(sel.suggestionKeys.has('suggestions:2')).toBe(false);
  });

  it('selects high confidence projects only', () => {
    const result = makeResult();
    const sel = defaultSelections(result);
    expect(sel.projects.size).toBe(1);
    expect(sel.projects.has(0)).toBe(true);
    expect(sel.projects.has(1)).toBe(false);
  });

  it('selects medium confidence contacts', () => {
    const result = makeResult();
    const sel = defaultSelections(result);
    expect(sel.contacts.size).toBe(1);
    expect(sel.contacts.has(0)).toBe(true);
  });

  it('does not select low confidence addresses', () => {
    const result = makeResult();
    const sel = defaultSelections(result);
    expect(sel.addresses.size).toBe(0);
  });

  it('handles null result', () => {
    const sel = defaultSelections(null);
    expect(sel.suggestionKeys.size).toBe(0);
    expect(sel.projects.size).toBe(0);
  });
});

describe('countSelected', () => {
  it('counts total selected across all categories', () => {
    const sel = {
      suggestionKeys: new Set(['a', 'b']),
      projects: new Set([0]),
      contacts: new Set([0, 1]),
      addresses: new Set(),
    };
    expect(countSelected(sel)).toBe(5);
  });

  it('handles null', () => {
    expect(countSelected(null)).toBe(0);
  });
});

describe('buildApplyPayload', () => {
  it('maps suggestion keys to suggestion objects', () => {
    const result = makeResult();
    const sel = { suggestionKeys: new Set(['suggestions:0', 'suggestions:2']) };
    const payload = buildApplyPayload(result, sel);
    expect(payload.suggestions.length).toBe(2);
    expect(payload.suggestions[0].field).toBe('email');
    expect(payload.suggestions[1].field).toBe('about');
  });

  it('maps project indices to project objects', () => {
    const result = makeResult();
    const sel = { projects: new Set([1]) };
    const payload = buildApplyPayload(result, sel);
    expect(payload.keyProjects.length).toBe(1);
    expect(payload.keyProjects[0].field).toBe('project2');
  });

  it('maps contact indices to contact objects', () => {
    const result = makeResult();
    const sel = { contacts: new Set([0]) };
    const payload = buildApplyPayload(result, sel);
    expect(payload.contacts.length).toBe(1);
  });

  it('maps address indices to address objects', () => {
    const result = makeResult();
    const sel = { addresses: new Set([0]) };
    const payload = buildApplyPayload(result, sel);
    expect(payload.addresses.length).toBe(1);
  });

  it('returns empty object for null result', () => {
    expect(buildApplyPayload(null, {})).toEqual({});
  });

  it('only includes categories with selections', () => {
    const result = makeResult();
    const sel = { suggestionKeys: new Set(['suggestions:0']) };
    const payload = buildApplyPayload(result, sel);
    expect(payload.suggestions).toBeDefined();
    expect(payload.keyProjects).toBeUndefined();
    expect(payload.contacts).toBeUndefined();
    expect(payload.addresses).toBeUndefined();
  });
});

describe('enrichmentStore', () => {
  beforeEach(() => {
    resetEnrichmentStore();
  });

  afterEach(() => {
    resetEnrichmentStore();
  });

  it('trigger sets state to triggering and calls API', async () => {
    const api = createMockApi({ queueEnrichment: vi.fn(async () => makeReadyPayload(makeResult())) });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Test Co', 'https://example.com');
    await new Promise((r) => setTimeout(r, 10));

    expect(api.calls.queue.length).toBe(1);
    expect(api.calls.queue[0][0]).toBe(1);
    const state = enrichmentStore.getState(1);
    expect(state.status).toBe('ready');
  });

  it('trigger without website sets failed state', async () => {
    const api = createMockApi();
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Test Co', null);
    await new Promise((r) => setTimeout(r, 10));

    expect(api.calls.queue.length).toBe(0);
    const state = enrichmentStore.getState(1);
    expect(state.status).toBe('failed');
    expect(state.error).toContain('no website');
  });

  it('synchronous ready response skips polling', async () => {
    const result = makeResult();
    const api = createMockApi({ queueEnrichment: vi.fn(async () => makeReadyPayload(result)) });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Test Co', 'https://example.com');
    await new Promise((r) => setTimeout(r, 10));

    expect(api.calls.poll.length).toBe(0);
    expect(enrichmentStore.getState(1).status).toBe('ready');
    expect(enrichmentStore.getState(1).result).toEqual(result);
  });

  it('synchronous failed response sets failed state', async () => {
    const api = createMockApi({ queueEnrichment: vi.fn(async () => makeFailedPayload('Website down')) });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Test Co', 'https://example.com');
    await new Promise((r) => setTimeout(r, 10));

    expect(enrichmentStore.getState(1).status).toBe('failed');
    expect(enrichmentStore.getState(1).error).toBe('Website down');
  });

  it('processing response starts polling', async () => {
    const result = makeResult();
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => makeReadyPayload(result)),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Test Co', 'https://example.com');
    await new Promise((r) => setTimeout(r, 50));

    expect(enrichmentStore.getState(1).status).toBe('ready');
    expect(api.calls.poll.length).toBeGreaterThanOrEqual(1);
  });

  it('handles multiple concurrent enrichments independently', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async (id) => {
        if (id === 1) return makeReadyPayload(makeResult({ companyId: 1, companyName: 'Co A' }));
        return makeProcessingPayload();
      }),
      fetchEnrichmentLatest: vi.fn(async (id) => {
        if (id === 2) return makeReadyPayload(makeResult({ companyId: 2, companyName: 'Co B' }));
        return makeProcessingPayload();
      }),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    enrichmentStore.trigger(2, 'Co B', 'https://b.com');
    await new Promise((r) => setTimeout(r, 50));

    expect(enrichmentStore.getState(1).status).toBe('ready');
    expect(enrichmentStore.getState(2).status).toBe('ready');
  });

  it('enforces max concurrent limit', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => makeProcessingPayload()),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    enrichmentStore.trigger(2, 'Co B', 'https://b.com');
    enrichmentStore.trigger(3, 'Co C', 'https://c.com');
    enrichmentStore.trigger(4, 'Co D', 'https://d.com');

    expect(enrichmentStore.getState(4).status).toBe('queued');
    expect(api.calls.queue.length).toBe(3);
  });

  it('processes queue when a slot frees up', async () => {
    let triggerCount = 0;
    const api = createMockApi({
      queueEnrichment: vi.fn(async (id) => {
        triggerCount++;
        if (id <= 3) return makeReadyPayload(makeResult());
        return makeReadyPayload(makeResult());
      }),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    enrichmentStore.trigger(2, 'Co B', 'https://b.com');
    enrichmentStore.trigger(3, 'Co C', 'https://c.com');
    enrichmentStore.trigger(4, 'Co D', 'https://d.com');
    await new Promise((r) => setTimeout(r, 50));

    expect(enrichmentStore.getState(4).status).toBe('ready');
    expect(api.calls.queue.length).toBe(4);
  });

  it('retry cancels previous polling and restarts', async () => {
    let pollCount = 0;
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => {
        pollCount++;
        return makeProcessingPayload();
      }),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 20));

    const firstPollRunId = enrichmentStore.getState(1).pollRunId;
    enrichmentStore.retry(1);
    await new Promise((r) => setTimeout(r, 20));

    const state = enrichmentStore.getState(1);
    expect(state.pollRunId).not.toBe(firstPollRunId);
  });

  it('apply updates state to applied and calls API', async () => {
    const result = makeResult();
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeReadyPayload(result)),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 10));

    const sel = defaultSelections(result);
    await enrichmentStore.apply(1, sel);

    expect(api.calls.apply.length).toBe(1);
    expect(enrichmentStore.getState(1).status).toBe('applied');
  });

  it('dismiss calls API and resets to idle', async () => {
    const result = makeResult();
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeReadyPayload(result)),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 10));

    await enrichmentStore.dismiss(1);

    expect(api.calls.dismiss.length).toBe(1);
    expect(enrichmentStore.getState(1).status).toBe('dismissed');
  });

  it('clear removes state and frees slot', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => makeProcessingPayload()),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    enrichmentStore.trigger(2, 'Co B', 'https://b.com');
    enrichmentStore.trigger(3, 'Co C', 'https://c.com');
    enrichmentStore.trigger(4, 'Co D', 'https://d.com');

    expect(enrichmentStore.getState(4).status).toBe('queued');

    enrichmentStore.clear(1);
    await new Promise((r) => setTimeout(r, 50));

    expect(enrichmentStore.getState(1)).toBeNull();
    expect(enrichmentStore.getState(4).status).not.toBe('queued');
  });

  it('stopPolling cancels current loop', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => makeProcessingPayload()),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 10));

    const pollRunId = enrichmentStore.getState(1).pollRunId;
    enrichmentStore.stopPolling(1);

    expect(enrichmentStore.getState(1).status).toBe('idle');
    expect(enrichmentStore.getState(1).pollRunId).not.toBe(pollRunId);
  });

  it('polling network error sets failed state', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => { throw new Error('Network error'); }),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 20));

    const state = enrichmentStore.getState(1);
    expect(state.status).toBe('failed');
    expect(state.error).toContain('Network error');
  });

  it('204 from poll endpoint sets failed state', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeProcessingPayload()),
      fetchEnrichmentLatest: vi.fn(async () => null),
    });
    setEnrichmentApi(api);

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 20));

    expect(enrichmentStore.getState(1).status).toBe('failed');
  });

  it('subscribe receives current state and updates on change', async () => {
    const api = createMockApi({
      queueEnrichment: vi.fn(async () => makeReadyPayload(makeResult())),
    });
    setEnrichmentApi(api);

    const updates = [];
    const unsub = enrichmentStore.subscribe((states) => updates.push({ ...states }));

    enrichmentStore.trigger(1, 'Co A', 'https://a.com');
    await new Promise((r) => setTimeout(r, 10));

    expect(updates.length).toBeGreaterThanOrEqual(2);
    expect(updates[0][1]).toBeUndefined();
    expect(updates[updates.length - 1][1]?.status).toBe('ready');

    unsub();
  });
});
