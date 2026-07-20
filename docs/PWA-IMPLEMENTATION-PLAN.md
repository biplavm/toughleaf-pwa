# PWA Implementation Plan — SDK-Anchored

## Prerequisites

- The PWA is built in the **main Tough Leaf SvelteKit app** (not this Studio repo).
- The app already vendors `@toughleaf/platform-sdk` v0.4.0 via `vendor-sdk.mjs` (same mechanism as this Studio).
- Auth, session management, and API base URLs are already wired through the SDK.

---

## 1. Phase 1 — Feature-to-SDK Mapping

### 1.1 Projects List + Details

| UI action | SDK method | Notes |
|---|---|---|
| Load project list | `client.projects.list(params?, options?)` | Supports `QueryOptions.staleTime` for stale-while-revalidate. |
| Load single project (detail) | `client.projects.get(projectId, { full: true })` | Full read includes nested relations. |
| List participants | `client.projects.listParticipants(projectId, options?)` | |
| List surveys / outreach status | `client.projects.listSurveys(projectId, params?, options?)` | |
| Single survey detail | `client.projects.getSurvey(projectId, companyId, options?)` | |
| Get bid package detail | `client.projects.getBidPackage(projectId, packageId, options?)` | |
| Observe project list reactively | `client.account.observeUser()` pattern | SDK has `observeQuery` via `ResourceCache` — use `client.resource(key, queryFn, options?)` for reactive cache subscriptions. |

**Cache keys to invalidate on PWA foreground/refresh:**

```
PROJECTS_LIST_KEY  → ["projects", "list"]
projectKey(id)     → ["projects", id]
projectFullKey(id) → ["projects", id, "full"]
participantsKey(id)→ ["projects", id, "participants"]
```

### 1.2 Company / Firm Lookup

| UI action | SDK method | Notes |
|---|---|---|
| Search firms | `client.companies.search(filter, { fresh?: true })` | Pass `{ fresh: true }` on explicit searches to bypass cache. |
| Get firm detail | `client.companies.get(companyId, options?)` | |
| Search history | `client.companies.listSearchHistory(params?, options?)` | |
| Lookup lists (states, certs, etc.) | `client.lookup.listStates()`, `client.lookup.listCertifications()`, `client.lookup.listCapabilities()`, `client.lookup.listBusinessSizes()`, `client.lookup.listUnions()`, `client.lookup.listCommodityCodes()`, `client.lookup.listEthnicities()` | All available — populate filter dropdowns. |
| Feedback | `client.companies.saveFeedback(searchId, companyId, feedback)` / `client.companies.clearFeedback(searchId, companyId)` | Read-only in v1; consider for v2. |

### 1.3 Profile View + Light Edits

| UI action | SDK method | Notes |
|---|---|---|
| Load current user | `client.account.getUser(options?)` | |
| Reactive user stream | `client.account.observeUser().subscribe(callback)` | Updates in real time after mutation. |
| Update name | `client.account.updateUser({ first_name, last_name })` | |
| Change password | `client.account.updatePassword({ current_password, new_password })` | |
| Load company | `client.account.getCompany(options?)` | |
| Load notification prefs | `client.account.getNotificationPreferences()` | |
| Update notification prefs | `client.account.updateNotificationPreferences(payload)` | |

### 1.4 Action-Required / Notifications

| UI action | SDK method | Notes |
|---|---|---|
| Feature flags | `client.env.getFeatures()` | `{ allow: string[], deny: string[] }` — gate PWA features. |
| Workflow data | `client.workflows.get(workflowId, options?)` | Inspect pending workflow steps/prompts. |
| Session events | `client.session.subscribe(callback)` | `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED` events. |

### ⚠️ Gaps in SDK (not covered today)

| Feature | Status | Workaround |
|---|---|---|
| **ClearSpend** | No SDK resource exists | Direct `client.http.get('/clearspeend/client-list')` (or whatever the route is). Alternatively, add a `ClearSpendResource` to the SDK. |
| **CertCheck roster** | No SDK resource exists | Direct `client.http.get('/certcheck/...')` path calls or add a resource. |
| **Push notifications** | No SDK resource | Requires backend integration. Scoped to Phase 2. |
| **Email verification status** | `UserData.status` field exists (numeric) | Decode in PWA. No dedicated "verify email" method in SDK. |

---

## 2. SDK Client Configuration for PWA

```ts
// src/lib/sdk.ts
import { createClient } from '@toughleaf/platform-sdk';

export const client = createClient({
  baseUrl: '/api/v1',
  fetchImpl: window.fetch.bind(window), // Service-worker-aware fetch
  onLogin: (session) => {
    // Persist to localStorage, trigger SvelteKit store update
    localStorage.setItem('tl_session', JSON.stringify(session));
  },
});

// Rehydrate from localStorage on cold start
const saved = localStorage.getItem('tl_session');
if (saved) {
  const { access_token } = JSON.parse(saved);
  client.setAccessToken(access_token);
  client.refresh().catch(() => client.logout());
}
```

Key point: the SDK uses `fetchImpl` — in a service-worker-enabled PWA, this means **all SDK HTTP calls pass through the SW**, enabling offline caching transparently.

---

## 3. Service Worker Strategy

SvelteKit's `src/service-worker.ts`:

```ts
import { build, files, version } from '$service-worker';

const CACHE_NAME = `tl-pwa-${version}`;
const STATIC = [...build, ...files];
const API_CACHE = 'tl-api-v1';

// Install: precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC))
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== API_CACHE).map((k) => caches.delete(k)))
    )
  );
});

// Fetch: stale-while-revalidate for read-only SDK endpoints
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Static assets: cache-first
  if (STATIC.includes(url.pathname)) {
    event.respondWith(caches.match(event.request) ?? fetch(event.request));
    return;
  }

  // Read API endpoints: stale-while-revalidate
  if (url.pathname.startsWith('/api/v1/') && event.request.method === 'GET') {
    // Exclude admin routes
    if (url.pathname.includes('/admin/')) return;

    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetched = fetch(event.request).then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          });
          return cached ?? fetched;
        })
      )
    );
    return;
  }
});
```

SDK cache keys (`PROJECTS_LIST_KEY`, `USER_ME_KEY`, etc.) can also be used to **programmatically invalidate the SW cache** on mutations via `caches.delete()` in a custom `fetchImpl` wrapper.

---

## 4. Offline Indicator Using SDK Cache State

The SDK's `ResourceCache` exposes `ResourceState<T>` with `isStale` and `isFetching` flags. Wrap this in a Svelte store:

```ts
// src/lib/stores/connectivity.ts
import { derived } from 'svelte/store';

// Subscribe to the SDK's session store
export const online = derived(
  client.session.state$,
  ($session, set) => {
    const go = () => set(navigator.onLine);
    go();
    window.addEventListener('online', go);
    window.addEventListener('offline', go);
  },
  navigator.onLine
);
```

Each page can access `$online` to show an offline badge. The SDK cache continues serving stale data while offline.

---

## 5. Install Prompt

```ts
// src/lib/install.ts
let deferredPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Trigger only after: logged in + visited a core page >= 2 times
});

export function showInstallPrompt() {
  return deferredPrompt !== null;
}

export async function install() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const result = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return result.outcome;
}
```

---

## 6. Mobile Layout Flag

Detect standalone mode and apply compact layout:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { browser } from '$app/environment';
  const isPWA = browser &&
    (window.matchMedia('(display-mode: standalone)').matches ||
     new URLSearchParams(window.location.search).has('pwa'));
</script>

<svelte:body class:pwa={isPWA} />
```

CSS:

```css
:global(body.pwa) {
  --nav-height: 56px; /* bottom tab bar */
}

:global(body.pwa table.responsive) {
  display: block;
}
:global(body.pwa table.responsive thead) {
  display: none;
}
:global(body.pwa table.responsive tr) {
  display: block;
  margin-bottom: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
}
:global(body.pwa table.responsive td) {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}
:global(body.pwa table.responsive td::before) {
  content: attr(data-label);
  font-weight: 600;
}
```

---

## 7. Web Manifest

Update `src/routes/(assets)/site.webmanifest/+server.ts`:

```ts
export function GET() {
  return new Response(JSON.stringify({
    name: 'Tough Leaf',
    short_name: 'Tough Leaf',
    start_url: '/projects?source=pwa',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2491eb',
    scope: '/',
    shortcuts: [
      { name: 'Projects', short_name: 'Projects', url: '/projects?source=pwa', icons: [{ src: '/icons/projects-96.png', sizes: '96x96' }] },
      { name: 'Lookup',   short_name: 'Lookup',   url: '/lookup?source=pwa',   icons: [{ src: '/icons/lookup-96.png', sizes: '96x96' }] },
      { name: 'Profile',  short_name: 'Profile',  url: '/profile?source=pwa',  icons: [{ src: '/icons/profile-96.png', sizes: '96x96' }] },
    ],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }), {
    headers: { 'Content-Type': 'application/manifest+json' },
  });
}
```

---

## 8. Route Gating — Unsupported PWA Routes

```svelte
<!-- src/routes/+layout.svelte -->
{#if isPWA && $page.url.pathname.startsWith('/admin')}
  <meta http-equiv="refresh" content="0;URL=/desktop-only?from={$page.url.pathname}" />
{/if}
```

Gate list:

| Route | PWA behavior |
|---|---|
| `/admin/**` | Redirect to "Open on desktop" page |
| `/projects/create` | Disabled, show "Open on desktop" prompt |
| `/integrations/**` | Redirect |
| `/settings/**` | Light profile only; rest blocked |
| `/reports/**` | Export-only link |

---

## 9. Bottom Tab Bar (PWA-Only)

```svelte
<!-- src/lib/components/PwaNav.svelte -->
{#if isPWA}
<nav class="pwa-tabs">
  <a href="/projects?source=pwa" class:active={$page.url.pathname.startsWith('/projects')}>
    <Icon name="folder" />
    <span>Projects</span>
  </a>
  <a href="/lookup?source=pwa" class:active={$page.url.pathname.startsWith('/lookup')}>
    <Icon name="search" />
    <span>Lookup</span>
  </a>
  <a href="/clearspeend?source=pwa" class:active={$page.url.pathname.startsWith('/clearspeend')}>
    <Icon name="chart" />
    <span>ClearSpend</span>
  </a>
  <a href="/profile?source=pwa" class:active={$page.url.pathname.startsWith('/profile')}>
    <Icon name="user" />
    <span>Profile</span>
  </a>
</nav>
{/if}
```

Hide the desktop `Navbar.svelte` hamburger when in PWA mode; replace with the tab bar.

---

## 10. Pull-to-Refresh Using SDK Cache Invalidation

```svelte
<!-- src/routes/projects/+page.svelte -->
<script>
  import { client, PROJECTS_LIST_KEY } from '$lib/sdk';

  let refreshing = false;

  async function handleRefresh() {
    refreshing = true;
    client.invalidate(PROJECTS_LIST_KEY); // Force re-fetch from server
    // SW stale-while-revalidate handles the actual network call
    setTimeout(() => (refreshing = false), 800);
  }
</script>

<div class="pull-to-refresh" class:refreshing>
  <!-- project cards -->
</div>
```

---

## 11. Simplified Project Detail (Mobile Card View)

```svelte
<!-- Key fields surfaced first, SDK-driven -->
<script>
  const projectId = $page.params.id;
  const project = client.resource(
    ['projects', projectId],
    (signal) => client.projects.get(projectId, { full: true, signal }),
    { staleTime: 30_000 }
  );
</script>

{#if $project.data}
<div class="project-card">
  <StatusBadge status={$project.data.status} />
  <h2>{$project.data.name}</h2>
  <dl>
    <dt>Due</dt><dd>{$project.data.bid_due_date}</dd>
    <dt>Type</dt><dd>{$project.data.project_type}</dd>
    <dt>Packages</dt><dd>{$project.data.bid_packages?.length ?? 0}</dd>
    <dt>Participants</dt><dd>{$project.data.participants_count}</dd>
  </dl>
  <!-- "More on desktop" collapsed section -->
  <details>
    <summary>Advanced details (desktop recommended)</summary>
    <!-- full data -->
  </details>
</div>
{/if}
```

---

## 12. Implementation Order

| Step | What | SDK dependency | Effort |
|---|---|---|---|
| 1 | Web manifest update | None (pure config) | 1h |
| 2 | Service worker | `fetchImpl` wired to SW | 4h |
| 3 | SDK PWA store (`$lib/sdk.ts`) | `createClient`, `session` | 2h |
| 4 | Install prompt | `beforeinstallprompt` + auth check | 2h |
| 5 | `isPWA` layout flag + CSS | None | 3h |
| 6 | Bottom tab bar | `isPWA` flag | 3h |
| 7 | Route gating | `isPWA` flag | 1h |
| 8 | Projects list + cards | `client.projects.list()`, `observeUser` | 6h |
| 9 | Project detail (mobile) | `client.projects.get()` + relations | 4h |
| 10 | Lookup search + detail | `client.companies.search()`, `.get()`, `.listStates()` | 5h |
| 11 | ClearSpend list + report | `client.http.get()` (or new resource) | 5h |
| 12 | CertCheck roster (view-only) | `client.http.get()` (or new resource) | 4h |
| 13 | Profile view + edit | `client.account.getUser()`, `.updateUser()`, `.updatePassword()` | 4h |
| 14 | Action-required / notifications | `client.workflows.get()`, `.env.getFeatures()` | 3h |
| 15 | Offline indicator | Navigator API + SDK `ResourceState.isStale` | 2h |
| 16 | Pull-to-refresh | `client.invalidate()` | 2h |
| 17 | Lighthouse audit + fixes | — | 3h |
| 18 | E2E smoke tests | `client.login()`, `client.projects.list()` in Playwright | 4h |

**Total Phase 1: ~58 hours**

---

## 13. Recommended SDK Additions (Backlog)

To close the gaps noted above, propose adding to the SDK:

1. **`ClearSpendResource`** — `listClients()`, `getReport(clientId)`, `getDashboard()`
2. **`CertCheckResource`** — `getRoster()`, `getCertificationStatus(companyId)`
3. **`NotificationResource`** — `listPending()`, `markRead(id)`, `getDueDates()`

These would follow the same pattern as `ProjectsResource` and `CompaniesResource` — constructor takes `http: HttpClient` and optional `cache: ResourceCache`, with invalidation keys for cache consistency.

---

## 14. Testing Plan (SDK-Focused)

```ts
// tests/e2e/pwa.spec.ts
import { test, expect } from '@playwright/test';

test('offline projects list serves from cache', async ({ page }) => {
  // Login via SDK client
  await page.goto('/projects?source=pwa');
  await expect(page.locator('.project-card')).toHaveCount(1);

  // Go offline
  await page.route('**/api/v1/**', (route) => route.abort());

  // Reload — SDk serves from cache via SW
  await page.reload();
  await expect(page.locator('.project-card')).toHaveCount(1);
  await expect(page.locator('.offline-badge')).toBeVisible();
});

test('install prompt appears after login + navigation', async ({ page }) => {
  // ...
});

test('pull-to-refresh invalidates SDK cache', async ({ page }) => {
  // Verify client.invalidate() triggers API refetch
});
```
