import { createClient, type ResourceState, type UserData } from '@toughleaf/platform-sdk';

const baseUrl = import.meta.env.VITE_TL_API_BASE ?? '/api/v1';
const client = createClient({ baseUrl });

const output = document.getElementById('output')!;
const recipeTitle = document.getElementById('recipe-title')!;
const recipeDesc = document.getElementById('recipe-desc')!;
const docLink = document.getElementById('doc-link') as HTMLAnchorElement;
const sessionStatus = document.getElementById('session-status')!;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const emailInput = document.getElementById('email') as HTMLInputElement;
const passwordInput = document.getElementById('password') as HTMLInputElement;

type RecipeId = 'lookup' | 'login' | 'observe';

const recipes: Record<
  RecipeId,
  { title: string; desc: string; doc: string; run: () => Promise<unknown> }
> = {
  lookup: {
    title: 'Recipe 01 — Public lookup',
    desc: 'No auth — same JSON as frontend public dropdowns.',
    doc: '../toughleaf-platform-sdk/docs/recipes/01-public-lookup.md',
    run: async () => {
      const states = await client.lookup.listStates();
      return { count: states.length, sample: states.slice(0, 3) };
    },
  },
  login: {
    title: 'Recipe 02 — Login + getUser',
    desc: 'Sign in then fetch GET /user.',
    doc: '../toughleaf-platform-sdk/docs/recipes/02-login-get-user.md',
    run: async () => {
      await ensureSignedIn();
      const user = await client.account.getUser();
      return { id: user.id, email: user.email, name: `${user.first_name} ${user.last_name}` };
    },
  },
  observe: {
    title: 'Recipe 03 — Observe dedupe',
    desc: 'Two subscribers → one GET /user.',
    doc: '../toughleaf-platform-sdk/docs/recipes/03-login-observe-dedupe.md',
    run: async () => {
      await ensureSignedIn();
      let fetchCount = 0;
      const originalFetch = globalThis.fetch.bind(globalThis);
      const wrappedFetch: typeof fetch = async (input, init) => {
        const url = String(input);
        if (url.includes('/user')) fetchCount += 1;
        return originalFetch(input, init);
      };
      const probe = createClient({ baseUrl, fetchImpl: wrappedFetch });
      probe.setAccessToken(client.getAccessToken());

      const results: string[] = [];
      const a = probe.account.observeUser().subscribe((s: ResourceState<UserData>) => {
        if (s.data) results.push(`header:${s.data.email}`);
      });
      const b = probe.account.observeUser().subscribe((s: ResourceState<UserData>) => {
        if (s.data) results.push(`profile:${s.data.email}`);
      });

      await new Promise((r) => setTimeout(r, 300));
      a.unsubscribe();
      b.unsubscribe();
      return { observers: results, getUserRequests: fetchCount };
    },
  },
};

let active: RecipeId = 'lookup';

function show(data: unknown): void {
  output.textContent = JSON.stringify(data, null, 2);
}

function setRecipe(id: RecipeId): void {
  active = id;
  const r = recipes[id];
  recipeTitle.textContent = r.title;
  recipeDesc.textContent = r.desc;
  docLink.href = r.doc;
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
    show(await recipes[active].run());
  } catch (err) {
    show({ error: String(err) });
  }
});

document.querySelectorAll('.tab').forEach((el) => {
  el.addEventListener('click', () => setRecipe((el as HTMLElement).dataset.recipe as RecipeId));
});

setRecipe('lookup');
