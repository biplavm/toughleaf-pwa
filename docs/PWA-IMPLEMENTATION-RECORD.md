# Tough Leaf PWA — Implementation Record

A project-and-firm companion app built on the vendored `@toughleaf/platform-sdk` (`0.4.0`). Svelte 4 + Vite 5 single-page PWA with offline caching, installable manifest, and a mobile-first responsive shell.

This document records what was built, the decisions made, and where to find each piece.

---

## Product overview

### The business

Tough Leaf is a **supplier-diversity and procurement outreach platform for the construction industry**. General Contractors (GCs) and project owners use it to run outreach on their bid packages — discovering qualified, often diverse-certified subcontractors and firms, sending them surveys, tracking participation, and documenting the outreach compliance that owners and public programs require.

### Where the PWA fits

The PWA is the **mobile companion** to the main Tough Leaf product. It is not a replacement for the desktop dashboard — it's the in-the-field adjunct that keeps outreach moving while projects do. The "Companion App" branding (tag below the logo, home-screen label, browser title) reinforces this positioning.

### What it does

| Job to be done | Where in the app |
|---|---|
| See what needs attention right now | Dashboard, Action Required |
| Track outreach workflow state per project | Outreach Hub |
| Browse projects, participants, bid packages, survey status | Projects |
| Find qualified diverse firms to invite | Firm Lookup (filter by state, certification, capability, business size, union status, commodity codes, ethnicity) |
| Manage the team operating the platform | Team Invites |
| Keep account and notification prefs current | Profile, Settings |

### Value proposition

Outreach compliance is typically a desktop-only, after-the-fact reporting exercise — reconstructed from email threads and spreadsheets long after the project is underway. The PWA turns it into a **real-time, in-the-field workflow**: a project manager or outreach coordinator can discover firms, trigger surveys, and document participation from a phone as projects move, not after the fact. Installable and offline-capable, so it works on job sites and in tunnels where connectivity drops.

### Why a PWA

- **Installable** without an app-store review cycle — outreach teams can add it to their home screen and operate immediately.
- **Offline-capable** via the service worker and `StaleWhileRevalidate` API caching — the dashboard, projects, and firm lists still load without a connection.
- **Auto-updating** — `registerType: 'autoUpdate'` means the latest outreach logic ships the moment it's deployed, with no manual refresh or version negotiation.
- **Single codebase** — the same vendored SDK and Laravel `/api/v1` contract as the main product, so the companion never drifts from the source of truth.

---

## Timeline

The repository began life as **Tough Leaf SDK Studio** — a workflow-first reference app with four interactive journeys, Playwright audits, and a standalone starter. It has since been refocused as the **Tough Leaf PWA**, a production-facing companion app. The Studio journeys and starter were removed in the refactor commit (`cf680ea`).

| Commit | Summary |
|---|---|
| `ec837d6` | Initial commit (SDK Studio) |
| `8789239`–`f92e710` | Studio journeys: TL-808, TL-809, TL-810, TL-878 |
| `7bbaf45` | **feat: add Tough Leaf PWA with SDK integration** |
| `cf680ea` | **refactor: remove SDK Studio, make PWA the sole entry point** |
| `23e5236` | fix: add vercel.json SPA rewrites, clean up SDK backend URL config |
| `fb4aee9` | fix: create proper 192x192 and 512x512 icons, add display_override for fullscreen |
| `2990083` | feat: add Companion App tag to UI branding |
| `e4cc380` | feat: use OAuth logo as app icon, stack Companion App tag under logo |
| `103c316` | feat: Phase 1 reporting — audit-ready checklist, outreach funnel, goal-vs-actual, participation breakdown |
| `9ffab31` | feat: Phase 2 — Reports route with cross-project metrics, progressive loading |
| `7ea89df` | chore: enable PWA dev mode so manifest/SW are available during development |
| `3d6f609` | feat: Phase 3 — enhanced firm lookup with outreach context, project status timeline |
| `143b2fb` | feat: rebuild dashboard with action-required, deadlines, project deep-links |

---

## Architecture

### Entry point

`src/main.js` mounts `src/pwa/App.svelte` into `#app` after importing the design tokens and component styles:

```js
import './pwa/styles/tokens.css';
import App from './pwa/App.svelte';
import './pwa/styles/pwa.css';
new App({ target: document.getElementById('app') });
```

### App shell (`src/pwa/App.svelte`)

- Gatekecks on `client.session` — shows `LoginView` when unauthenticated, the app shell otherwise.
- Hash-based router (`src/pwa/lib/router.js`) with nine routes.
- Responsive sidebar (`NavBar.svelte`) with a mobile overlay toggle.
- Topbar with an offline pill bound to the `online` store.
- `InstallBanner` shown only when a `beforeinstallprompt` event has been captured and the app is not already standalone.

### Routing (`src/pwa/lib/router.js`)

Lightweight hash router — no framework dependency. `navigate(hash)` sets `window.location.hash`; `routeStore()` is a Svelte-compatible store that pushes the current hash to subscribers on `hashchange`. Default route is `/dashboard`.

### SDK integration (`src/pwa/lib/sdk.js`)

- Imports `createClient` from the vendored bundle at `vendor/@toughleaf/platform-sdk/index.js` (aliased in `vite.config.ts`).
- Resolves the backend base URL from `VITE_PUBLIC_TOUGHLEAF_BACKEND` or `VITE_TL_API_BASE`, defaulting to the Vite proxy at `/api/v1`.
- Restores the session from `localStorage` on boot, calls `client.refresh()`, and clears it on failure.
- Persists `access_token` back to `localStorage` on every session change.
- Exports `getUserResource()` — a Svelte store adapter over `client.account.observeUser()`.

### Stores (`src/pwa/lib/stores.js`)

- `online` — `navigator.onLine` with `online`/`offline` listeners.
- `isStandalone` — `matchMedia('(display-mode: standalone)')` with a change listener.
- `getDeferredPrompt()` / `triggerInstall()` — capture and surface the Chrome `beforeinstallprompt` event.

---

## Pages (`src/pwa/pages/`)

| Route | Component | Purpose |
|---|---|---|
| `/dashboard` | `DashboardPage.svelte` | Action-required queue, approaching deadlines, recent projects with deep-links, recent searches. |
| `/outreach` | `OutreachPage.svelte` | Outreach hub — surveys and workflow state per project. |
| `/actions` | `ActionRequiredPage.svelte` | Action-required queue (notifications, pending items). |
| `/projects` | `ProjectsPage.svelte` | Project list and detail with participants, surveys, bid packages. Detail has Overview and Report tabs. Deep-links via `?id=`. |
| `/lookup` | `LookupPage.svelte` | Firm/company search with filters. Results show outreach-context badges and an Add to Project action. |
| `/reports` | `ReportsPage.svelte` | Cross-project metrics: active projects, firms engaged, awarded dollars, diverse share, outreach distribution, deadlines, goals at risk. Progressive loading. |
| `/invites` | `InvitesPage.svelte` | Team invite lifecycle: list, create, resend, delete. |
| `/profile` | `ProfilePage.svelte` | User profile, name edit, password change, notification prefs. |
| `/settings` | `SettingsPage.svelte` | App settings. |

Each page calls the SDK client directly and uses the skeleton components for loading states.

---

## Components (`src/pwa/components/`)

- `NavBar.svelte` — collapsible sidebar with sectioned nav (Overview, Workspace, Reporting, Account), user footer, and the Tough Leaf logo + **Companion App** tag.
- `LoginView.svelte` — centered login card with logo, **Companion App** tag, and credential form.
- `InstallBanner.svelte` — bottom banner prompting install when the deferred prompt is available.
- `Modal.svelte` — generic modal wrapper with focus trap and named `footer` slot.
- `ProjectReport.svelte` — reporting surface for a single project: compliance checklist, participation goal, outreach funnel, project timeline, participation-by-certification breakdown. Rendered in the Report tab of `ProjectsPage`.
- `LogoLoader.svelte` — Lottie-backed loading animation.
- `skeleton/` — `Skeleton`, `SkeletonCard`, `SkeletonDetail`, `SkeletonList`, `SkeletonTable`, `SkeletonText` for loading placeholders.

---

## Reporting layer

The PWA's reporting layer turns outreach state into proof — computed entirely client-side from data the SDK already exposes. No new API endpoints, no backend changes.

### Computation library (`src/pwa/lib/reporting.js`)

Pure functions — data in, metrics out. No SDK calls, no side effects. Every function is fixture-tested in `reporting.test.js` (58 tests).

| Function | Input | Output | Used by |
|---|---|---|---|
| `auditReady(project, participants, surveys)` | A single project's full data | Weighted checklist with critical/non-critical items, `criticalMissing` count, `passed` flag | `ProjectReport.svelte` |
| `outreachFunnel(surveys)` | A project's survey list | 5-stage counts (invited → viewed → interested → submitted → awarded), conversion rates, surveys grouped by stage | `ProjectReport.svelte` |
| `goalVsActual(project, surveys)` | A project + its surveys | Parses `req_participation`, computes actual diverse % from awarded amounts. Honest `null` when goal is unparseable or no awards exist. | `ProjectReport.svelte`, `crossProjectMetrics` |
| `participationBreakdown(participants, surveys, project)` | Participants + surveys + project | Firms grouped by certification type, awarded counts, required-cert gaps | `ProjectReport.svelte` |
| `projectTimeline(project)` | A project | Lifecycle stages (reached/current/future), milestones from project + bid-package date fields, overdue flags | `ProjectReport.svelte` |
| `crossProjectMetrics(projectResults[])` | Array of `{ project, participants, surveys }` | Active project count, deduplicated firm count, awarded dollars, diverse share %, outreach status distribution, goals at risk, approaching-deadline buckets | `ReportsPage.svelte` |
| `buildOutreachContext(allSurveys)` | Flat array of all surveys across projects | `Map<companyId, { invitedCount, awardedCount, contacted, projectIds }>` | `LookupPage.svelte` |
| `outreachBadge(context, companyId)` | Context map + company ID | `{ label, tone }` — "Awarded on 1 project" / "Invited to 2 projects" / "Never contacted" | `LookupPage.svelte` |
| `actionRequiredSurveys(surveysWithProjects)` | Surveys tagged with project name/ID | Sorted list of surveys needing action, with due date, overdue flag, company/project names | `DashboardPage.svelte` |
| `approachingDeadlines(projects, days)` | Project list + day window | Projects with `bid_due_date` within the window, sorted by days left | `DashboardPage.svelte`, `ReportsPage.svelte` |

### Design decisions

- **No traffic-light on goal-vs-actual.** `req_participation` is a free-text string. The computation shows the raw goal string alongside the computed actual, and returns `null` when the goal can't be parsed or no awards exist — rather than asserting a green/yellow/red state on a brittle parse. Structuring this field is a loud SDK v0.5.0 ask.
- **Critical vs non-critical audit items.** `auditReady` distinguishes critical failures (no participants, no diverse firms, outreach not started, awards undocumented) from non-critical ones (outreach completion undocumented, certification gaps). A project "passes" only if zero critical items fail — a weighted score, not a rigid binary.
- **Progressive loading.** `ReportsPage` and `DashboardPage` load the project list first, then fetch per-project detail sequentially. Summary cards and deadlines appear immediately; heavier metrics (awards, goals at risk, action items) fill in as each project's data arrives. A progress indicator shows "N of M projects loaded."
- **Deep-linking.** The dashboard and reports pages navigate to `/projects?id=123`. `ProjectsPage.loadProjects()` reads the `?id=` query param and auto-opens that project, bypassing the list view.
- **Outreach context is opt-in.** `LookupPage` only builds the outreach context map after search results are returned — it doesn't preload all surveys on page mount. The "Only show firms not yet contacted" filter operates on the built context.

### Reports route (`/reports`)

Dedicated route under the "Reporting" nav section. Keeps the dashboard operational and isolates heavier cross-project computation to a surface the user opts into (avoids N+1 on the launch screen).

Sections:
1. **Summary cards** — Active Projects, Firms Engaged (deduplicated by `company_id`), Total Awarded ($), Diverse Share (%)
2. **Outreach Status Distribution** — bar chart of bid packages by status (Not Started, Filling Package, In Progress, Closed)
3. **Approaching Deadlines** — 7/14/30-day toggle, table + list with days remaining
4. **Goals at Risk** — projects where computed diverse % is below the parsed goal, showing the gap

Honest empty states: "No awards recorded yet", "No goals at risk" (with explanation of what qualifies), "No deadlines in the next N days".

### Project Report tab

The project detail view has two tabs: **Overview** (operational — bid packages, participants, surveys) and **Report** (proof — rendered by `ProjectReport.svelte`). This separates "work it" from "prove it."

The Report tab shows:
1. **Compliance Checklist** — audit-ready badge + line-by-line checklist with critical tags
2. **Participation Goal** — raw goal string, parsed target, computed actual, awarded dollar breakdown
3. **Outreach Funnel** — horizontal track+bar chart with gradient blues and conversion rates
4. **Project Timeline** — lifecycle stage progression with reached/current/future states + key date milestones
5. **Participation by Certification** — cards per cert type with firm counts, awarded counts, required-cert gaps

### Enhanced Firm Lookup

`LookupPage` adds outreach context to search results:
- After results load, the page fetches all project surveys and builds an outreach context map via `buildOutreachContext()`
- Each result shows a badge: "Awarded on N projects" (green), "Invited to N projects" (blue), "Never contacted" (muted)
- "Only show firms not yet contacted" checkbox filters to firms with no outreach history
- "Add to project" button opens a modal with a project picker; calls `client.projects.addParticipants()` and updates the badge in place

### Dashboard

The dashboard is the launch screen — operational, not reporting-heavy. Three stat cards (Active Projects, Action Required, Due <14 Days) link to their respective routes. An Action Required section shows the top 8 surveys needing attention, sorted by due date, each tappable to deep-link to the project. An Approaching Deadlines section shows projects due within 14 days. Recent Projects rows deep-link to specific projects via `?id=`.

---

## PWA configuration

### Manifest (`vite.config.ts`)

`vite-plugin-pwa` in `generateSW` mode with `registerType: 'autoUpdate'`. The manifest declares:

- `name`: Tough Leaf
- `short_name`: Tough Leaf
- `start_url`: `/?source=pwa`
- `display`: standalone, with `display_override` of `['standalone', 'fullscreen', 'minimal-ui']`
- `orientation`: portrait
- `background_color`: `#ffffff`, `theme_color`: `#2491eb`
- `scope`: `/`
- Three app shortcuts: Projects, Lookup, Dashboard.
- Icons:
  - `/icons/icon.svg` — SVG, `sizes: 'any'`, `purpose: 'any'` (the OAuth logo).
  - `/icons/icon-192.png` — 192×192 PNG, `purpose: 'any'`.
  - `/icons/icon-512.png` — 512×512 PNG, `purpose: 'any maskable'`.

### Auto-update behavior

`registerType: 'autoUpdate'` + `injectRegister: 'auto'` injects the service worker registration and enables `skipWaiting`/`clientsClaim`. On each visit the browser checks for a new SW, installs it in the background, and it takes over on the next navigation. `workbox.globPatterns` precaches `**/*.{js,css,html,ico,png,svg,woff2,json}` so any changed asset triggers an update.

### Runtime caching

A single `StaleWhileRevalidate` rule for `/api/v1/(?!auth/)` with cache name `tl-api`, capped at 200 entries / 1 hour. Auth requests bypass the cache.

### SPA fallback

`workbox.navigateFallback: '/index.html'` ensures deep links resolve to the app shell. `vercel.json` mirrors this with SPA rewrites for production hosting.

### Dev mode

`devOptions.enabled = true` generates the manifest and a dev service worker during `npm run dev`, so installability and icon behavior can be verified without a production build. Dev SW artifacts are written to `dev-dist/` (gitignored).

---

## Icons and branding

### App icon

The OAuth logo (`static/logo-tough_leaf-oauth.svg` provided by the user) was promoted to the app icon:

- Moved to `public/icons/icon.svg` (Vite only serves `public/`).
- `index.html` declares the SVG favicon first, with the 192 PNG and an `apple-touch-icon` fallback (iOS does not support SVG touch icons).
- The manifest lists the SVG as the primary `any` icon.
- The existing `icon-192.png` and `icon-512.png` were **solid blue squares** (a single color). They were regenerated from the SVG using `sharp` — 192×192 on white for `any`, 512×512 on white with maskable safe-zone padding (~70% logo) for `any maskable`. `sharp` was installed temporarily and removed after rendering.

### Companion App tag

Branded the UI as **Tough Leaf Companion App**:

- `index.html` — `<title>` is `Tough Leaf Companion App`; `apple-mobile-web-app-title` is `Companion App` (home-screen label).
- `NavBar.svelte` — sidebar header stacks the **Companion App** badge below the logo (`flex-direction: column`).
- `LoginView.svelte` — login brand stacks the badge below the logo (`.login-brand` set to `flex-direction: column` in `pwa.css`).
- The badge uses design tokens (`--tl-color-neutral-100` background, `--tl-font-size-xs`, uppercase, `--tl-border-radius-sm`) so it matches the sidebar section labels.

---

## Styling

Two CSS files, no UI framework:

- `src/pwa/styles/tokens.css` — the Tough Leaf Design Token System. Source of truth for colors (HSL-based with a static brand color), spacing, font sizes, weights, border radii, and transitions. All components reference these tokens.
- `src/pwa/styles/pwa.css` — component styles for the app shell, sidebar, topbar, login, forms, tables, cards, modals, and skeletons. Mobile-first with a `@media` block at the bottom that adjusts the sidebar header padding and logo size.

---

## Backend configuration

The SDK resolves the API base URL in this order (`src/pwa/lib/sdk.js`):

1. `VITE_PUBLIC_TOUGHLEAF_BACKEND`
2. `VITE_TL_API_BASE`
3. `/api/v1` (Vite proxy default)

The Vite dev server proxies `/api` → `process.env.PUBLIC_TOUGHLEAF_BACKEND ?? 'http://localhost:8080'` with `changeOrigin: true`. See `.env.example` for the knobs. No secrets are committed.

---

## Build and development

```bash
npm ci          # install
npm run dev     # dev server on port 5175 (strictPort)
npm run build   # production build + PWA assets
npm run preview # preview the production build
npm run typecheck
npm test        # vitest, src and scripts
```

Build output: `dist/` with hashed JS/CSS, `manifest.webmanifest`, `sw.js`, and `workbox-*.js`. The PWA plugin precaches ~14 entries (~440 KiB).

Tests: `npx vitest run src/pwa/lib/reporting.test.js` — 58 fixture-based tests covering all computation functions and edge cases (empty inputs, unparseable goals, priority ordering, dedup, partial loads, overdue detection, badge pluralization).

---

## Repository layout

```
index.html                      # app shell, favicon + meta tags
vite.config.ts                  # Svelte + PWA plugin, manifest, workbox, dev proxy, devOptions
vercel.json                     # SPA rewrites for production
public/
  icons/
    icon.svg                    # OAuth logo — primary app icon
    icon-192.png                # rendered from the SVG (any)
    icon-512.png                # rendered from the SVG (any maskable)
  images/                       # logo-tl-dark.svg, logo-tl-light.svg
  animations/                   # Lottie JSON for the logo loader
src/
  main.js                       # mounts App.svelte
  pwa/
    App.svelte                  # session gate, router, app shell (9 routes)
    components/                 # NavBar, LoginView, InstallBanner, Modal, ProjectReport, LogoLoader, skeleton/
    lib/
      sdk.js                    # SDK client, session restore, user resource store
      router.js                 # hash router (supports ?id= deep-links)
      stores.js                 # online, isStandalone, deferred install prompt
      reporting.js              # pure computation functions (10 exports)
      reporting.test.js         # 58 fixture-based tests
    pages/                      # 9 page components (see Pages table)
    styles/
      tokens.css                # Tough Leaf design tokens
      pwa.css                   # component styles
vendor/@toughleaf/platform-sdk/ # vendored, checksum-verified SDK bundle
docs/                           # implementation plan, onboarding, walkthrough, this record
```

---

## What was removed

The SDK Studio refactor (`cf680ea`) removed:

- The four interactive Studio journeys (TL-808, TL-809, TL-810, TL-878).
- The Playwright E2E suite and `@playwright/test` dependency.
- The `starter/` standalone app.
- The `STUDIO_API_BASE` config in favor of the PWA's `VITE_PUBLIC_TOUGHLEAF_BACKEND` / `VITE_TL_API_BASE` knobs.

The `package-lock.json` was cleaned up in the icon commit to drop the stale vitest/playwright transitive dependencies. `vitest` was subsequently reinstalled as a dev dependency to run the reporting computation tests.

---

## What's NOT built yet

Features that require SDK expansions or backend changes — documented for the next phase:

| SDK endpoint needed | Feature it unlocks | Priority |
|---|---|---|
| `GET /projects/{id}/logs` | Outreach effort log (GFE documentation) | Highest — the #1 compliance artifact |
| `GET /projects/surveys` | Cross-project survey view with workflow status groups | High — enables portfolio-level outreach monitoring |
| `POST /shareable/project/{id}` | Shareable project links for owners/agencies | High — frictionless compliance submission |
| `POST /files` + `GET /files/{id}` | Photo/document upload for field evidence capture | Medium — completes the "in-the-field" value prop |
| `BidPackageData.summary` passthrough | Pre-aggregated outreach counts (faster mobile load) | Medium — performance optimization |
| Structured `req_participation` field | Reliable goal-vs-actual traffic-light | Medium — removes the brittle free-text parse |
