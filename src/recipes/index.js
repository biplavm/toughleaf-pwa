import { createClient } from '@toughleaf/platform-sdk';

const DOC = 'https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes';

/**
 * @typedef {'lookup' | 'login' | 'observe' | 'update-user' | 'observe-company' | 'update-company'} RecipeId
 *
 * @typedef {object} RecipeContext
 * @property {string} baseUrl
 * @property {import('@toughleaf/platform-sdk').ToughLeafClient} client
 * @property {() => Promise<void>} ensureSignedIn
 *
 * @typedef {object} RecipeDef
 * @property {RecipeId} id
 * @property {string} title
 * @property {string} desc
 * @property {string} doc
 * @property {string} [ticket]
 * @property {string} [harness]
 * @property {boolean} needsAuth
 * @property {string} code
 * @property {(ctx: RecipeContext) => Promise<unknown>} run
 */

/** @type {Record<RecipeId, RecipeDef>} */
export const RECIPES = {
  lookup: {
    id: 'lookup',
    title: 'Recipe 01 — Public lookup',
    desc: 'No auth — same JSON as frontend public dropdowns.',
    doc: `${DOC}/01-public-lookup.md`,
    needsAuth: false,
    code: `const states = await client.lookup.listStates();
return { count: states.length, sample: states.slice(0, 3) };`,
    run: async ({ client }) => {
      const states = await client.lookup.listStates();
      return { count: states.length, sample: states.slice(0, 3) };
    },
  },

  login: {
    id: 'login',
    title: 'Recipe 02 — Login + getUser',
    desc: 'Sign in then fetch GET /user.',
    doc: `${DOC}/02-login-get-user.md`,
    needsAuth: true,
    code: `await client.login({ email, password });
const user = await client.account.getUser();
return { id: user.id, email: user.email };`,
    run: async ({ client, ensureSignedIn }) => {
      await ensureSignedIn();
      const user = await client.account.getUser();
      return {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      };
    },
  },

  observe: {
    id: 'observe',
    title: 'Recipe 03 — Observe dedupe',
    desc: 'Two observeUser subscribers → one GET /user (TC dedupe).',
    doc: `${DOC}/03-login-observe-dedupe.md`,
    harness: 'H11',
    needsAuth: true,
    code: `const a = client.account.observeUser().subscribe(/* header */);
const b = client.account.observeUser().subscribe(/* profile */);
// Network: GET /user appears once`,
    run: async ({ baseUrl, client, ensureSignedIn }) => {
      await ensureSignedIn();
      let fetchCount = 0;
      const originalFetch = globalThis.fetch.bind(globalThis);
      const wrappedFetch = async (input, init) => {
        const url = String(input);
        if (url.includes('/user') && (init?.method ?? 'GET') === 'GET') {
          fetchCount += 1;
        }
        return originalFetch(input, init);
      };
      const probe = createClient({ baseUrl, fetchImpl: wrappedFetch });
      probe.setAccessToken(client.getAccessToken());

      const results = [];
      const a = probe.account.observeUser().subscribe((s) => {
        if (s.data) results.push(`header:${s.data.email}`);
      });
      const b = probe.account.observeUser().subscribe((s) => {
        if (s.data) results.push(`profile:${s.data.email}`);
      });

      await new Promise((r) => setTimeout(r, 300));
      a.unsubscribe();
      b.unsubscribe();
      return { observers: results, getUserRequests: fetchCount, deduped: fetchCount <= 1 };
    },
  },

  'update-user': {
    id: 'update-user',
    title: 'Recipe 04 — updateUser (MUT-A)',
    desc: 'PUT /user → invalidate USER_ME_KEY → observeUser refetches (playground #btn-update-user).',
    doc: `${DOC}/04-update-user-muta.md`,
    ticket: 'TL-808',
    harness: 'TC-002',
    needsAuth: true,
    code: `await client.account.updateUser({ first_name: 'Updated' });
// observeUser subscribers refetch — no manual getUser()`,
    run: async ({ baseUrl, client, ensureSignedIn }) => {
      await ensureSignedIn();
      let fetchCount = 0;
      const originalFetch = globalThis.fetch.bind(globalThis);
      const countingFetch = async (input, init) => {
        const url = String(input);
        if (url.includes('/user') && (init?.method ?? 'GET') === 'GET') {
          fetchCount += 1;
        }
        return originalFetch(input, init);
      };
      const probe = createClient({ baseUrl, fetchImpl: countingFetch });
      probe.setAccessToken(client.getAccessToken());

      let observedName;
      const sub = probe.account.observeUser().subscribe((state) => {
        if (state.data?.first_name) observedName = state.data.first_name;
      });

      await new Promise((r) => setTimeout(r, 300));

      const updated = await client.account.updateUser({ first_name: 'Updated' });
      await new Promise((r) => setTimeout(r, 500));

      sub.unsubscribe();

      return {
        putResponse: updated.first_name,
        observedAfterMutate: observedName,
        getUserRequestsAfterSubscribe: fetchCount,
        mutaInvalidated: observedName === updated.first_name,
      };
    },
  },

  'observe-company': {
    id: 'observe-company',
    title: 'Recipe 05 — observeCompany',
    desc: 'Cached GET /company — one request per cold cache (playground #btn-observe-company).',
    doc: `${DOC}/05-observe-company.md`,
    ticket: 'TL-808',
    harness: 'TC-014',
    needsAuth: true,
    code: `client.account.observeCompany().subscribe((state) => {
  if (state.data) console.log(state.data.company_name);
});`,
    run: async ({ baseUrl, client, ensureSignedIn }) => {
      await ensureSignedIn();
      let companyFetchCount = 0;
      const originalFetch = globalThis.fetch.bind(globalThis);
      const countingFetch = async (input, init) => {
        const url = String(input);
        if (
          url.includes('/company') &&
          !url.includes('notification-preferences') &&
          (init?.method ?? 'GET') === 'GET'
        ) {
          companyFetchCount += 1;
        }
        return originalFetch(input, init);
      };
      const probe = createClient({ baseUrl, fetchImpl: countingFetch });
      probe.setAccessToken(client.getAccessToken());

      /** @type {import('@toughleaf/platform-sdk').CompanyData | undefined} */
      let snapshot;
      const sub = probe.account.observeCompany().subscribe((state) => {
        if (state.data) snapshot = state.data;
      });

      await new Promise((r) => setTimeout(r, 400));
      sub.unsubscribe();

      return {
        company: snapshot
          ? {
              id: snapshot.id,
              company_name: snapshot.company_name,
            }
          : null,
        getCompanyRequests: companyFetchCount,
      };
    },
  },

  'update-company': {
    id: 'update-company',
    title: 'Recipe 06 — updateCompany',
    desc: 'PUT /company → invalidate [company] prefix (playground #btn-update-company).',
    doc: `${DOC}/06-update-company.md`,
    ticket: 'TL-808',
    harness: 'TC-020',
    needsAuth: true,
    code: `const company = await client.account.updateCompany({ company_name: 'Updated Co' });
// observeCompany observers refetch automatically`,
    run: async ({ client, ensureSignedIn }) => {
      await ensureSignedIn();
      const updated = await client.account.updateCompany({ company_name: 'Updated Co' });

      let observed;
      const sub = client.account.observeCompany().subscribe((state) => {
        if (state.data?.company_name) observed = state.data.company_name;
      });

      await new Promise((r) => setTimeout(r, 500));
      sub.unsubscribe();

      return {
        putResponse: updated.company_name,
        observedAfterInvalidate: observed,
        cacheInvalidated: observed === updated.company_name,
      };
    },
  },
};
