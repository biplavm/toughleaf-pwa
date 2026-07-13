import { createClient } from '@toughleaf/platform-sdk';
import sdkManifest from '../vendor/@toughleaf/platform-sdk/manifest.json';
import { RECIPES } from './recipes/index.js';

const baseUrl = import.meta.env.VITE_TL_API_BASE ?? '/api/v1';
const trace = [];
const output = /** @type {HTMLElement} */ (document.getElementById('output'));
const traceList = /** @type {HTMLOListElement} */ (document.getElementById('trace-list'));

function renderTrace() {
  traceList.innerHTML = trace.length
    ? trace
        .map(
          (item) => `<li class="trace-row ${item.ok ? 'ok' : 'error'}">
            <span class="trace-method">${item.method}</span>
            <span class="trace-path">${item.path}</span>
            <strong>${item.status}</strong>
            <small>${item.duration_ms}ms</small>
            <details><summary>response</summary><pre>${escapeHtml(item.response)}</pre></details>
          </li>`,
        )
        .join('')
    : '<li class="trace-empty">Run a journey to inspect its HTTP contract.</li>';
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

/** @type {typeof fetch} */
const tracedFetch = async (input, init) => {
  const startedAt = performance.now();
  const url = String(input);
  try {
    const response = await globalThis.fetch(input, init);
    const body = await response.clone().text();
    trace.push({
      method: init?.method ?? 'GET',
      path: url.replace(/^https?:\/\/[^/]+/, ''),
      status: response.status,
      ok: response.ok,
      duration_ms: Math.round(performance.now() - startedAt),
      response: body ? body.slice(0, 1200) : '<empty body>',
    });
    renderTrace();
    return response;
  } catch (error) {
    trace.push({
      method: init?.method ?? 'GET',
      path: url.replace(/^https?:\/\/[^/]+/, ''),
      status: 'NETWORK_ERROR',
      ok: false,
      duration_ms: Math.round(performance.now() - startedAt),
      response: error instanceof Error ? error.message : String(error),
    });
    renderTrace();
    throw error;
  }
};

const client = createClient({ baseUrl, fetchImpl: tracedFetch });
const sessionStatus = /** @type {HTMLElement} */ (document.getElementById('session-status'));
const loginForm = /** @type {HTMLFormElement} */ (document.getElementById('login-form'));
const emailInput = /** @type {HTMLInputElement} */ (document.getElementById('email'));
const passwordInput = /** @type {HTMLInputElement} */ (document.getElementById('password'));
const runButton = /** @type {HTMLButtonElement} */ (document.getElementById('btn-run'));
let active = 'account';

document.getElementById('sdk-version').textContent =
  `${sdkManifest.name}@${sdkManifest.version} · ${sdkManifest.tag}`;

function show(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

function numberOrUndefined(id) {
  const value = /** @type {HTMLInputElement} */ (document.getElementById(id)).value.trim();
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) throw new Error(`${id} must be a positive integer`);
  return parsed;
}

function readConfig() {
  return {
    roleId: numberOrUndefined('role-id') ?? 0,
    inviteFirstName: /** @type {HTMLInputElement} */ (document.getElementById('invite-first-name')).value.trim() || 'SDK',
    inviteLastName: /** @type {HTMLInputElement} */ (document.getElementById('invite-last-name')).value.trim() || 'Demo',
    participantCompanyId: numberOrUndefined('participant-company-id'),
    clientId: numberOrUndefined('client-id'),
    workflowId: /** @type {HTMLInputElement} */ (document.getElementById('workflow-id')).value.trim() || undefined,
  };
}

function setRecipe(id) {
  active = id;
  const recipe = RECIPES[id];
  document.getElementById('recipe-title').textContent = recipe.title;
  document.getElementById('recipe-desc').textContent = recipe.desc;
  document.getElementById('recipe-ticket').textContent = recipe.ticket;
  document.getElementById('recipe-code').textContent = recipe.code;
  /** @type {HTMLAnchorElement} */ (document.getElementById('doc-link')).href = recipe.doc;
  document.querySelectorAll('[data-recipe]').forEach((element) => {
    const item = /** @type {HTMLElement} */ (element);
    item.classList.toggle('active', item.dataset.recipe === id);
  });
}

async function ensureSignedIn() {
  if (client.getAccessToken()) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) throw new Error('Enter demo credentials before running a journey');
  await client.login({ email, password });
}

client.session.subscribe((session) => {
  sessionStatus.textContent = session ? session.event : 'SIGNED_OUT';
  sessionStatus.dataset.state = session ? 'signed-in' : 'signed-out';
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    await client.login({ email: emailInput.value.trim(), password: passwordInput.value });
    show({ status: 'passed', message: 'Session established', baseUrl });
  } catch (error) {
    show({ status: 'failed', error: error instanceof Error ? error.message : String(error) });
  }
});

runButton.addEventListener('click', async () => {
  trace.length = 0;
  renderTrace();
  runButton.disabled = true;
  runButton.textContent = 'Running…';
  output.textContent = 'Executing real SDK calls…';
  try {
    const result = await RECIPES[active].run({ client, ensureSignedIn, config: readConfig() });
    show({ journey: active, sdk: sdkManifest.version, ...result });
  } catch (error) {
    show({
      journey: active,
      status: 'failed',
      error: error instanceof Error ? error.message : String(error),
      steps: error && typeof error === 'object' ? error.journeySteps : undefined,
      cleanup: 'Check the final HTTP trace and backend state before retrying.',
    });
  } finally {
    runButton.disabled = false;
    runButton.textContent = 'Run journey';
  }
});

document.querySelectorAll('[data-recipe]').forEach((element) => {
  const item = /** @type {HTMLElement} */ (element);
  item.addEventListener('click', () => setRecipe(item.dataset.recipe));
});

renderTrace();
setRecipe(active);
