import { client } from './sdk.js';

const TRIGGER_TIMEOUT_MS = 120_000;
const TRIGGER_MAX_RETRIES = 2;

function apiUrl(path) {
  const base = client.http.apiBaseUrl.replace(/\/$/, '');
  return `${base}${path}`;
}

function authHeaders(hasBody = false) {
  const token = client.getAccessToken();
  const headers = { 'Accept': 'application/json' };
  if (hasBody) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function parseResponse(resp) {
  if (resp.status === 204) return null;
  const text = await resp.text();
  if (!text) return null;
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    return null;
  }
  if (json?.success === false) {
    const msg = json?.error?.message ?? 'Server returned an error';
    throw new Error(msg);
  }
  return json?.data ?? json;
}

async function readError(resp) {
  try {
    const text = await resp.text();
    if (!text) return `HTTP ${resp.status}`;
    const json = JSON.parse(text);
    return json?.error?.message ?? json?.message ?? `HTTP ${resp.status}`;
  } catch {
    return `HTTP ${resp.status}`;
  }
}

function withTimeout(signal, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
}

export async function queueEnrichment(companyId, trigger = 'user', opts = {}, signal) {
  let lastError = null;
  for (let attempt = 0; attempt <= TRIGGER_MAX_RETRIES; attempt++) {
    const { signal: timeoutSignal, cleanup } = withTimeout(signal, TRIGGER_TIMEOUT_MS);
    try {
      const body = { trigger };
      if (opts?.reclaim) body.reclaim = true;
      const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment`), {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify(body),
        signal: timeoutSignal,
      });
      if (!resp.ok) {
        const errMsg = await readError(resp);
        throw new Error(errMsg);
      }
      return await parseResponse(resp);
    } catch (e) {
      lastError = e;
      if (attempt < TRIGGER_MAX_RETRIES && !signal?.aborted) {
        await new Promise((r) => setTimeout(r, attempt === 0 ? 2000 : 3000));
        continue;
      }
    } finally {
      cleanup();
    }
  }
  throw lastError ?? new Error('Enrichment trigger failed');
}

export async function fetchEnrichmentLatest(companyId, signal) {
  const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment/latest`), {
    method: 'GET',
    headers: authHeaders(false),
    signal,
  });
  if (resp.status === 204) return null;
  if (!resp.ok) {
    const errMsg = await readError(resp);
    throw new Error(errMsg);
  }
  return await parseResponse(resp);
}

export async function applyEnrichment(companyId, enrichmentId, payload) {
  const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment/${enrichmentId}/apply`), {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const errMsg = await readError(resp);
    throw new Error(errMsg);
  }
}

export async function dismissEnrichment(companyId, enrichmentId) {
  const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment/${enrichmentId}/dismiss`), {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({}),
  });
  if (!resp.ok) {
    const errMsg = await readError(resp);
    throw new Error(errMsg);
  }
}

export const enrichmentApi = {
  queueEnrichment,
  fetchEnrichmentLatest,
  applyEnrichment,
  dismissEnrichment,
};
