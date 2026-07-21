import { client } from './sdk.js';

const TRIGGER_TIMEOUT_MS = 120_000;

function apiUrl(path) {
  const base = client.http.apiBaseUrl.replace(/\/$/, '');
  return `${base}${path}`;
}

function authHeaders() {
  const token = client.getAccessToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function parseResponse(resp) {
  if (resp.status === 204) return null;
  const text = await resp.text();
  if (!text) return null;
  try {
    const json = JSON.parse(text);
    return json?.data ?? json;
  } catch {
    return null;
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
  const { signal: timeoutSignal, cleanup } = withTimeout(signal, TRIGGER_TIMEOUT_MS);
  try {
    const body = { trigger };
    if (opts?.reclaim) body.reclaim = true;
    const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment`), {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
      signal: timeoutSignal,
    });
    if (!resp.ok) {
      throw new Error(`Enrichment trigger failed: ${resp.status}`);
    }
    return await parseResponse(resp);
  } finally {
    cleanup();
  }
}

export async function fetchEnrichmentLatest(companyId, signal) {
  const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment/latest`), {
    method: 'GET',
    headers: authHeaders(),
    signal,
  });
  if (resp.status === 204) return null;
  if (!resp.ok) {
    throw new Error(`Enrichment poll failed: ${resp.status}`);
  }
  return await parseResponse(resp);
}

export async function applyEnrichment(companyId, enrichmentId, payload) {
  const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment/${enrichmentId}/apply`), {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    throw new Error(`Enrichment apply failed: ${resp.status}`);
  }
}

export async function dismissEnrichment(companyId, enrichmentId) {
  const resp = await fetch(apiUrl(`/companies/${companyId}/enrichment/${enrichmentId}/dismiss`), {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({}),
  });
  if (!resp.ok) {
    throw new Error(`Enrichment dismiss failed: ${resp.status}`);
  }
}

export const enrichmentApi = {
  queueEnrichment,
  fetchEnrichmentLatest,
  applyEnrichment,
  dismissEnrichment,
};
