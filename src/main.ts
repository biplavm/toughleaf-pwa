import { createClient } from '@toughleaf/platform-sdk';
import { RECIPES, type RecipeId } from './recipes';

const baseUrl = import.meta.env.VITE_TL_API_BASE ?? '/api/v1';
const client = createClient({ baseUrl });

const output = document.getElementById('output')!;
const recipeTitle = document.getElementById('recipe-title')!;
const recipeDesc = document.getElementById('recipe-desc')!;
const recipeMeta = document.getElementById('recipe-meta')!;
const recipeCode = document.getElementById('recipe-code')!;
const docLink = document.getElementById('doc-link') as HTMLAnchorElement;
const sessionStatus = document.getElementById('session-status')!;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

let active: RecipeId = 'lookup';

function show(data: unknown): void {
  output.textContent = JSON.stringify(data, null, 2);
}

function setRecipe(id: RecipeId): void {
  active = id;
  const r = RECIPES[id];
  recipeTitle.textContent = r.title;
  recipeDesc.textContent = r.desc;
  docLink.href = r.doc;
  recipeCode.textContent = r.code;

  const metaParts: string[] = [];
  if (r.ticket) metaParts.push(r.ticket);
  if (r.harness) metaParts.push(`Harness: ${r.harness}`);
  if (r.needsAuth) metaParts.push('Requires sign-in');
  recipeMeta.textContent = metaParts.length ? metaParts.join(' · ') : 'No auth required';

  document.querySelectorAll('.tab').forEach((el) => {
    el.classList.toggle('active', (el as HTMLElement).dataset.recipe === id);
  });
}

async function ensureSignedIn(): Promise<void> {
  if (client.getAccessToken()) return;
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  if (!email || !password) {
    throw new Error('Enter email and password in Sign in section first');
  }
  await client.login({ email, password });
}

client.session.subscribe((session) => {
  sessionStatus.textContent = session ? `Session: ${session.event}` : 'Session: SIGNED_OUT';
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await client.login({ email: emailInput.value.trim(), password: passwordInput.value });
    show({ ok: true, message: 'Signed in' });
  } catch (err) {
    show({ error: String(err) });
  }
});

document.getElementById('btn-run')!.addEventListener('click', async () => {
  try {
    show(
      await RECIPES[active].run({
        baseUrl,
        client,
        ensureSignedIn,
      }),
    );
  } catch (err) {
    show({ error: String(err) });
  }
});

document.querySelectorAll('.tab').forEach((el) => {
  el.addEventListener('click', () => setRecipe((el as HTMLElement).dataset.recipe as RecipeId));
});

setRecipe('lookup');
