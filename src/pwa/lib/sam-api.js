import { client } from './sdk.js';

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
    throw new Error(json?.error?.message ?? 'Server returned an error');
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

export async function listAgents() {
  const resp = await fetch(apiUrl('/admin/agents'), {
    method: 'GET',
    headers: authHeaders(false),
  });
  if (!resp.ok) throw new Error(await readError(resp));
  const data = await parseResponse(resp);
  return Array.isArray(data) ? data : [];
}

export async function getAgent(agentId) {
  const resp = await fetch(apiUrl(`/admin/agents/${agentId}`), {
    method: 'GET',
    headers: authHeaders(false),
  });
  if (!resp.ok) throw new Error(await readError(resp));
  return await parseResponse(resp);
}

export async function findSamAgent() {
  const agents = await listAgents();
  return agents.find((a) => a?.slug === 'sam' && a?.enabled) ?? null;
}

export async function createRun(agentId, input) {
  const resp = await fetch(apiUrl('/admin/agents/runs'), {
    method: 'POST',
    headers: authHeaders(true),
    body: JSON.stringify({ agent_id: agentId, input }),
  });
  if (!resp.ok) throw new Error(await readError(resp));
  return await parseResponse(resp);
}

export async function listRuns(agentId) {
  const params = agentId ? `?agent_id=${agentId}` : '';
  const resp = await fetch(apiUrl(`/admin/agents/runs${params}`), {
    method: 'GET',
    headers: authHeaders(false),
  });
  if (!resp.ok) throw new Error(await readError(resp));
  const data = await parseResponse(resp);
  return Array.isArray(data) ? data : [];
}

export async function getRun(runId) {
  const resp = await fetch(apiUrl(`/admin/agents/runs/${runId}`), {
    method: 'GET',
    headers: authHeaders(false),
  });
  if (!resp.ok) throw new Error(await readError(resp));
  return await parseResponse(resp);
}

export async function getRunLogs(runId) {
  const resp = await fetch(apiUrl(`/admin/agents/run-logs/${runId}`), {
    method: 'GET',
    headers: authHeaders(false),
  });
  if (!resp.ok) throw new Error(await readError(resp));
  const data = await parseResponse(resp);
  return Array.isArray(data) ? data : [];
}

export const samApi = {
  listAgents,
  getAgent,
  findSamAgent,
  createRun,
  listRuns,
  getRun,
  getRunLogs,
};
