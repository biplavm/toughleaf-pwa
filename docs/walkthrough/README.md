# Studio walkthrough

Clone-and-follow docs for Tough Leaf SDK Studio `0.4.0`. Run the journeys, read the HTTP inspector, and decide whether the public SDK is enough to build a real frontend.

## Prerequisites

1. Laravel on `http://127.0.0.1:8080` with base seed plus:

```bash
php artisan db:seed --class=SdkDemoSeeder
```

2. Demo values from the seeder output (do **not** commit them):

- `TL_DEMO_EMAIL` / `TL_DEMO_PASSWORD`
- `TL_DEMO_WORKFLOW_ID`
- `TL_DEMO_PARTICIPANT_COMPANY_NAME` (exact firm name in search)
- optional `TL_DEMO_SEARCH_STATE` (default `NY`)
- `TL_DEMO_ROLE_ID` for Team invites
- `TL_DEMO_PARTICIPANT_COMPANY_ID` for Project delivery

3. Studio:

```bash
npm ci
npm run dev
```

Open `http://127.0.0.1:5175`.

## API target

Default is **local**: Studio uses `/api/v1` and Vite proxies `/api` to `http://127.0.0.1:8080`.

Override with either:

1. `.env` — `VITE_TL_API_BASE=https://staging.example/api/v1`
2. `src/studio.config.js` — `STUDIO_API_BASE`

Env wins when set. See the root [README](../../README.md#api-target). Staging, main, and production use the same knobs; they are not the default. Do not commit secrets.

If you are signed in as an Owner, leave **Client ID** empty. It is an admin-only input.

## How to read Studio

1. **Journey result** — what Studio attempted, assertions, and cleanup.
2. **HTTP contract inspector** — method, path, status, request, response, invalidation, refetch.
3. **Portable TypeScript** — public SDK calls that move into another frontend.
4. **Session and demo configuration** — runtime input only. One SDK client for the page.

A journey did not pass merely because JavaScript did not throw. A trustworthy pass has observable assertions and successful cleanup.

## Stories (recommended order)

| # | Story | File |
|---|---|---|
| 1 | **GC project to outreach** (primary) | [01-golden-path.md](01-golden-path.md) |
| 2 | Account + company | [02-account-company.md](02-account-company.md) |
| 3 | Team invites | [03-team-invites.md](03-team-invites.md) |
| 4 | Project delivery | [04-project-delivery.md](04-project-delivery.md) |

Start with the golden path. The regressions prove the earlier contracts still hold.

## What PASS means

- `#output` JSON has `"status": "passed"`
- cleanup entries are `"cleaned"` where the journey creates disposable data
- for the golden path: `"http_status": 204`, `"name": "API zero-residue"` with `"status": "passed"`
- mail delivery is verified outside Studio (Mailpit or your env mail sink)

## What Studio does not claim

- Credentials, seed IDs, private screenshots, database queries, or mail-sink API code in this repo
- Every Laravel endpoint
- Product retention policy for workflow-generated messages

## Re-audit with Playwright

See [AUDIT.md](AUDIT.md).
