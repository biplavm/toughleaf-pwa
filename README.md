# Tough Leaf SDK Studio

Workflow-first reference app for the Tough Leaf Platform SDK (`0.4.0`). Vendored, checksum-verified SDK bundle. Four journeys, one public client, honest HTTP inspection, and cleanup as part of pass/fail.

## Start here

1. [docs/walkthrough/README.md](docs/walkthrough/README.md) — clone-and-follow index
2. [docs/walkthrough/01-golden-path.md](docs/walkthrough/01-golden-path.md) — primary **GC project to outreach** steps
3. [docs/walkthrough/AUDIT.md](docs/walkthrough/AUDIT.md) — Playwright re-audit of the same contract

Ask the environment owner for demo credentials and seed IDs. Do not commit them.

## API target

Studio talks to **one** Laravel `/api/v1` base URL. There is no environment picker in the UI.

**Default = local**

- Code default: `STUDIO_API_BASE = '/api/v1'` in [`src/studio.config.js`](src/studio.config.js)
- Vite proxies `/api` → `http://127.0.0.1:8080` ([`vite.config.ts`](vite.config.ts))
- Leave `VITE_TL_API_BASE` unset for that path

**Override (either knobs; env wins when set)**

1. `.env` / `.env.local` (see [`.env.example`](.env.example)):

```bash
# VITE_TL_API_BASE=http://127.0.0.1:8080/api/v1
# VITE_TL_API_BASE=https://staging.example/api/v1
# VITE_TL_API_BASE=https://main.example/api/v1
```

2. Edit the named constant in [`src/studio.config.js`](src/studio.config.js):

```js
export const STUDIO_API_BASE = '/api/v1';
```

[`src/main.js`](src/main.js) resolves:

```js
const baseUrl = import.meta.env.VITE_TL_API_BASE ?? STUDIO_API_BASE;
```

Staging, main, and production use the same knobs. They are not the default. Operator-owned URLs only. No secrets in the repository. If signed in as Owner, leave **Client ID** empty (admin-only input).

## Golden journeys

| Journey | Contract exercised |
|---|---|
| GC project to outreach (TL-878) | project, package, company search, feedback, participant, survey, workflow 204/refetch, API cleanup |
| Account + company (TL-808) | login, shared cache observation, user mutation, company read, restore |
| Invite lifecycle (TL-809) | list, create, 204/refetch, resend, verification, delete |
| Project lifecycle (TL-810) | create, full read, 204/refetch update, package, participant, cleanup |

Every run shows request body, method/path, actual HTTP status, latency, response/error, declared invalidation, observed refetch, assertions, and cleanup state. Disposable invites, projects, packages, searches, and participants are removed in `finally` blocks.

The workflow-generated message is a Laravel side effect. Studio reports the accepted `204` and refetched survey; delivery is verified separately in the environment's mail sink. Studio contains no Mailpit API client.

## Clean setup

```bash
npm ci
npx playwright install chromium
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Development server (default port **5175**):

```bash
npm run dev
```

Open `http://127.0.0.1:5175`.

Playwright E2E defaults to port **5176** (`TL_STUDIO_PORT`) so it does not collide with a manual `npm run dev`.

## Laravel demo seed and preflight

From the Laravel repository, after the normal base seed:

```bash
php artisan db:seed --class=SdkDemoSeeder
```

This creates an idempotent, isolated demo owner, a complete GC company, a participant company, and a minimal workflow. The seeder output supplies local-only values; do not commit them to Studio.

Then validate the complete environment before opening Studio:

```bash
TL_API_BASE_URL=http://127.0.0.1:8080/api/v1 \
TL_DEMO_EMAIL=<printed by seeder> \
TL_DEMO_PASSWORD=<printed by seeder> \
TL_DEMO_WORKFLOW_ID=<printed by seeder> \
TL_DEMO_PARTICIPANT_COMPANY_ID=<printed by seeder> \
TL_DEMO_PARTICIPANT_COMPANY_NAME=<printed or verified name> \
npm run preflight
```

`TL_LOCAL_CANDIDATE=1` is only for development before an official SDK release. Omit it for the release gate; preflight then requires the `v0.4.0` manifest. `TL_EXPECTED_VERSION` can select the mechanical release candidate version.

## SDK bundle contract

Studio never reaches into the SDK monorepo at runtime. It imports the checksummed bundle under `vendor/@toughleaf/platform-sdk/`.

```bash
# Official release input
SDK_TAG=vX.Y.Z GITHUB_TOKEN=... npm run vendor:sdk

# Local candidate input
cd ../toughleaf-platform-sdk
npm ci && npm run build:all
cd ../toughleaf-sdk-studio
npm run vendor:sdk
```

Both paths verify `manifest.json` checksums. `npm run preflight` additionally requires Studio, SDK manifest, and expected versions to agree.

`SDK_REPO` can select another repository and `SDK_API_BASE` can select a GitHub Enterprise API endpoint. Every downloaded asset is rejected unless it matches the release `manifest.json` checksum.

## Real E2E

The shell Playwright test always runs. Laravel-backed journeys activate only when their environment is explicitly supplied:

```bash
TL_E2E_API_BASE=http://127.0.0.1:8080/api/v1 \
TL_DEMO_EMAIL=<printed by seeder> \
TL_DEMO_PASSWORD=<printed by seeder> \
TL_DEMO_ROLE_ID=<valid owner role> \
TL_DEMO_WORKFLOW_ID=<printed by seeder> \
TL_DEMO_PARTICIPANT_COMPANY_ID=<printed by seeder> \
TL_DEMO_PARTICIPANT_COMPANY_NAME=<exact search result name> \
npm run test:e2e
```

The participant company id supports the TL-810 regression. The exact participant name and workflow id drive the TL-878 journey from real search results.

## Standalone starter

`starter/` is a separate Vite + TypeScript application. It imports only `@toughleaf/platform-sdk`, vendors a checksum-verified SDK bundle, and reconstructs the same public workflow without importing Studio source. See `starter/README.md`.

## Distribution

GitHub Releases is the current distribution channel; npm remains private. Publishing order is SDK release, verified vendor import, then Studio release. Pushes, PRs, tags, and releases are separate explicit public actions.

## License

UNLICENSED — internal Tough Leaf use.
