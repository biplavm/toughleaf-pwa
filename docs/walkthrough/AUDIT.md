# Studio walkthrough audit

How to re-audit the Studio journeys with Playwright after a human walkthrough or video recording. No secrets.

Canonical human paths: [README.md](README.md) and [01-golden-path.md](01-golden-path.md).

---

## Anti-patterns

| Do not | Why |
|---|---|
| Fill **Client ID** as a non-admin Owner | Laravel rejects create before disposable data exists. Leave Client ID empty for Owner. |
| Treat “no exception” as PASS | Require `#output` `"status": "passed"`, cleanup `"cleaned"`, and golden **API zero-residue**. |
| Treat one local green run as a published release | Judge PASS from `#output` and cleanup on this machine. |
| Embed Mailpit or admin outreach APIs in Studio | Delivery stays an external oracle. |
| Commit credentials, seed IDs, or private evidence into Studio | Seeder output and `TL_DEMO_*` stay operator-local. |

---

## PASS criteria (golden)

All required:

- `"journey": "golden"`
- `"sdk": "0.4.0"` (or the vendored manifest version under test)
- `"status": "passed"`
- `outreach.http_status === 204`
- cleanup entries `"cleaned"`
- `"name": "API zero-residue"` with `"status": "passed"`
- `#trace-list` shows the workflow `204` and survey refetch

Mailpit recipient/subject correlation is human/external (Step 13 in the golden path). Not asserted inside `studio.spec.js`.

---

## Replay — golden only

From the cloned Studio repository root:

```powershell
$env:TL_E2E_API_BASE = 'http://127.0.0.1:8080/api/v1'
$env:TL_DEMO_EMAIL = '<seeder>'
$env:TL_DEMO_PASSWORD = '<seeder>'
$env:TL_DEMO_WORKFLOW_ID = '<seeder>'
$env:TL_DEMO_PARTICIPANT_COMPANY_NAME = '<exact search result>'

npx playwright test tests/e2e/studio.spec.js --grep "TL-876 GC project-to-outreach"
```

Maps to Steps 1–12 and 14 of [01-golden-path.md](01-golden-path.md). Selectors: `getByLabel`, `getByRole`, `#session-status`, `#output`, `#trace-list`.

---

## Replay — full suite

Shell + golden + TL-808 + TL-809 + TL-810 (5 tests).

```powershell
$env:TL_E2E_API_BASE = 'http://127.0.0.1:8080/api/v1'
$env:TL_DEMO_EMAIL = '<seeder>'
$env:TL_DEMO_PASSWORD = '<seeder>'
$env:TL_DEMO_ROLE_ID = '<owner role>'
$env:TL_DEMO_WORKFLOW_ID = '<seeder>'
$env:TL_DEMO_PARTICIPANT_COMPANY_ID = '<seeder>'
$env:TL_DEMO_PARTICIPANT_COMPANY_NAME = '<exact firm name>'

npx playwright test tests/e2e/studio.spec.js
```

Dev UI default port is **5175**. Playwright defaults to **5176** via `TL_STUDIO_PORT` so it does not collide with a manual `npm run dev`.

---

## API target reminder

Default local: `/api/v1` through Vite proxy to `http://127.0.0.1:8080`.

Override:

1. `.env` → `VITE_TL_API_BASE`
2. `src/studio.config.js` → `STUDIO_API_BASE`

Env wins when set. See root README **API target**.
