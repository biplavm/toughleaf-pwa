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
- Hash-based router (`src/pwa/lib/router.js`) with eight routes.
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
| `/dashboard` | `DashboardPage.svelte` | Overview of projects, actions, and outreach status. |
| `/outreach` | `OutreachPage.svelte` | Outreach hub — surveys and workflow state per project. |
| `/actions` | `ActionRequiredPage.svelte` | Action-required queue (notifications, pending items). |
| `/projects` | `ProjectsPage.svelte` | Project list and detail with participants, surveys, bid packages. |
| `/lookup` | `LookupPage.svelte` | Firm/company search with filters (states, certs, capabilities, etc.). |
| `/invites` | `InvitesPage.svelte` | Team invite lifecycle: list, create, resend, delete. |
| `/profile` | `ProfilePage.svelte` | User profile, name edit, password change, notification prefs. |
| `/settings` | `SettingsPage.svelte` | App settings. |

Each page calls the SDK client directly and uses the skeleton components for loading states.

---

## Components (`src/pwa/components/`)

- `NavBar.svelte` — collapsible sidebar with sectioned nav, user footer, and the Tough Leaf logo + **Companion App** tag.
- `LoginView.svelte` — centered login card with logo, **Companion App** tag, and credential form.
- `InstallBanner.svelte` — bottom banner prompting install when the deferred prompt is available.
- `Modal.svelte` — generic modal wrapper.
- `LogoLoader.svelte` — Lottie-backed loading animation.
- `skeleton/` — `Skeleton`, `SkeletonCard`, `SkeletonDetail`, `SkeletonList`, `SkeletonTable`, `SkeletonText` for loading placeholders.

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

Build output: `dist/` with hashed JS/CSS, `manifest.webmanifest`, `sw.js`, and `workbox-*.js`. The PWA plugin precaches ~14 entries (~360 KiB).

---

## Repository layout

```
index.html                      # app shell, favicon + meta tags
vite.config.ts                  # Svelte + PWA plugin, manifest, workbox, dev proxy
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
    App.svelte                  # session gate, router, app shell
    components/                 # NavBar, LoginView, InstallBanner, Modal, LogoLoader, skeleton/
    lib/
      sdk.js                    # SDK client, session restore, user resource store
      router.js                 # hash router
      stores.js                 # online, isStandalone, deferred install prompt
    pages/                      # 8 page components (see Pages table)
    styles/
      tokens.css                # Tough Leaf design tokens
      pwa.css                   # component styles
vendor/@toughleaf/platform-sdk/ # vendored, checksum-verified SDK bundle
docs/                           # implementation plan, onboarding, walkthrough
```

---

## What was removed

The SDK Studio refactor (`cf680ea`) removed:

- The four interactive Studio journeys (TL-808, TL-809, TL-810, TL-878).
- The Playwright E2E suite and `@playwright/test` dependency.
- The `starter/` standalone app.
- The `vitest` dev dependency and Studio-specific test scripts.
- The `STUDIO_API_BASE` config in favor of the PWA's `VITE_PUBLIC_TOUGHLEAF_BACKEND` / `VITE_TL_API_BASE` knobs.

The `package-lock.json` was cleaned up in the final commit to drop the stale vitest/playwright transitive dependencies.
