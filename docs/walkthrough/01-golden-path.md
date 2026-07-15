# 01 — GC project to outreach (golden path)

Primary Studio story (TL-876 / TL-878). A GC prepares a bid opportunity, finds a firm, includes it in the project, and starts the invitation workflow through one public SDK client.

Prerequisites and API target: [README.md](README.md). Re-audit: [AUDIT.md](AUDIT.md).

---

## How to use

1. Open this file beside the browser.
2. For each step: do the action → pause on the UI proof → continue.
3. Do not declare PASS until Step 14.

---

## Anti-patterns

| Do not | Why |
|---|---|
| Fill **Client ID** as a non-admin Owner | Laravel rejects project create. Leave Client ID empty for Owner. |
| Call PASS because JS did not throw | Require `"status": "passed"`, cleanup `"cleaned"`, and API zero-residue. |
| Put credentials or seed IDs in this guide or on a public recording | Use seeder output / `TL_DEMO_*` env vars only. |
| Skip reading the HTTP inspector | A trustworthy pass shows method/path/status and refetch in the inspector. |
| Skip Mailpit and claim outreach delivery | Studio proves `204` + refetch; delivery is external (Step 13). |

---

## Step 0 — Prep

| | |
|---|---|
| **Action** | Laravel up with `SdkDemoSeeder`. Mail sink reachable. `npm run dev` in the Studio repo. Open `http://127.0.0.1:5175`. |
| **Pass if** | Page loads. No credentials in the address bar. |
| **Playwright** | Config webServer / `baseURL` on port `5176` by default for E2E (`TL_STUDIO_PORT`). |
| **On camera** | “Stack ready. Studio 0.4.0 against real Laravel.” |

---

## Step 1 — Shell visible

| | |
|---|---|
| **Action** | With session signed out, show page chrome. |
| **Pass if** | Heading **GC project to outreach**. Buttons for all four journeys. Text **HTTP contract inspector**. |
| **Playwright** | Shell test: heading, four buttons, inspector text. |
| **On camera** | “Four journeys, one SDK client, HTTP inspector visible.” |

---

## Step 2 — Sign-in

| | |
|---|---|
| **Action** | Fill **Email** / **Password** from seeder or `TL_DEMO_*`. Click **Sign in**. |
| **Pass if** | `#session-status` is `SIGNED_IN`. |
| **Playwright** | `signIn(page)`. |
| **On camera** | “Signed in.” |

---

## Step 3 — Config golden inputs

| | |
|---|---|
| **Action** | **Workflow ULID**, exact **Firm name**, **Search state** (default `NY`). Leave **Client ID** empty for Owner. |
| **Pass if** | Fields set; Client ID blank. |
| **Playwright** | `getByLabel('Workflow ULID')`, `getByLabel('Firm name')`. |
| **On camera** | “Workflow and exact firm. Client ID empty on purpose.” |

---

## Step 4 — Run journey

| | |
|---|---|
| **Action** | Select **GC project to outreach**. Click **Run journey**. Wait until `#output` is complete JSON. |
| **Pass if (interim)** | No local precondition error. Final PASS is Step 14. |
| **Playwright** | `expectPassed(page)`. |
| **On camera** | “Golden path running. Not PASS yet.” |

---

## Step 5 — Preflight company and workflow

| | |
|---|---|
| **Action** | In `#output`, find **Preflight company and workflow**. Optionally inspect `GET /company` and `GET /workflows/{ulid}`. |
| **Pass if** | Step `"status": "passed"`. Reads return `200`. |
| **Playwright** | Aggregate golden PASS. |
| **On camera** | “Preflight: company + server-defined workflow.” |

---

## Step 6 — Create disposable project + bid package

| | |
|---|---|
| **Action** | Show **Create disposable project** and **Create bid package**. Inspector: `POST /projects`, `POST .../bid_packages`. |
| **Pass if** | Both passed; creates `201`; `project.id` and `bid_package.id` present. |
| **Playwright** | Aggregate golden PASS. |
| **On camera** | “Real disposable project and Electrical package.” |

---

## Step 7 — Search real firms

| | |
|---|---|
| **Action** | Show **Search real firms**. Inspector: `POST /companies/search?fresh=true`, then `GET` results. |
| **Pass if** | Step passed; configured firm name selected. |
| **Playwright** | Aggregate golden PASS. |
| **On camera** | “Search returns the exact firm.” |

---

## Step 8 — Remove and restore firm feedback

| | |
|---|---|
| **Action** | Show **Remove and restore firm feedback**. Inspector: `score: -1`, refetch, then `score: 0`, refetch. |
| **Pass if** | Step `"status": "passed"`. |
| **Playwright** | Aggregate golden PASS. |
| **On camera** | “Feedback remove and restore are observable.” |

---

## Step 9 — Select firm as participant + refetch

| | |
|---|---|
| **Action** | Show **Select firm as participant** and **Observe participant refetch**. Inspector: `POST .../participants/add` → `204`, then `GET .../participants` → `200`. |
| **Pass if** | Both passed; selected company present after refetch. |
| **Playwright** | `#trace-list` includes participant `204`. |
| **On camera** | “Participant add is 204; list re-read after invalidation.” |

---

## Step 10 — Upsert survey and package scope

| | |
|---|---|
| **Action** | Show **Upsert survey and package scope**. Inspector: `POST .../surveys/{company}`. |
| **Pass if** | Step passed; survey has Laravel workflow step/prompt. |
| **Playwright** | Aggregate golden PASS. |
| **On camera** | “Survey workflow state comes from Laravel.” |

---

## Step 11 — Choose Send invitation (key contract beat)

| | |
|---|---|
| **Action** | Pause on **Choose Send invitation**. Inspector: `POST .../workflow` → **204**, empty body, then GET survey refetch. In `#output`: `outreach.http_status: 204` and external delivery note. |
| **Pass if** | Step passed; `#output` and `#trace-list` show `204`; refetch observed. |
| **Playwright** | `#output` contains `"http_status": 204`; `#trace-list` contains `204`. |
| **On camera** | “Empty 204 is not the resource. SDK invalidates and refetches.” |

---

## Step 12 — Cleanup in Journey result

| | |
|---|---|
| **Action** | Scroll cleanup: prepare participant cleanup → remove participant/survey → delete package → delete project → delete search → **API zero-residue**. |
| **Pass if (partial)** | Cleanup entries `"cleaned"`. Confirm zero-residue in Step 14. |
| **Playwright** | `#output` contains `"name": "API zero-residue"`. |
| **On camera** | “Cleanup in finally. Cleanup failure fails the journey.” |

---

## Step 13 — Mailpit (outside Studio)

| | |
|---|---|
| **Action** | Open the environment mail sink. Correlate by recipient and subject. Studio has no Mailpit client. |
| **Pass if** | Expected outreach message visible. |
| **Playwright** | Human / private oracle only. |
| **On camera** | “Delivery outside the SDK. Mailpit confirms recipient and subject.” |

---

## Step 14 — Final PASS criteria

| | |
|---|---|
| **Action** | Return to Studio. Highlight `#output` top-level fields. |
| **Pass if (all required)** | `"journey": "golden"` · `"sdk": "0.4.0"` · `"status": "passed"` · `outreach.http_status === 204` · cleanup `cleaned` · API zero-residue `passed`. |
| **Playwright** | Golden test `status: 'passed'` + 204 + zero-residue strings. |
| **On camera** | “Local PASS: assertions, cleanup, and zero-residue.” |

---

## Step 15 — Close

| | |
|---|---|
| **Action** | Stop on journey result + inspector. |
| **Say** | “Studio 0.4.0 golden path followed live. Same contract: Playwright Appendix in AUDIT.md.” |
| **Do not say** | Mailpit is part of Studio; empty Client ID is optional for Owner—leave it blank. |

---

## Important branches

| Situation | What to learn |
|---|---|
| Missing workflow config | Local precondition error before creating data. |
| Exact firm absent from search | Search may succeed while business selection fails. |
| Laravel auth/permission/validation error | Inspector keeps the real status and body. |
| Laravel `204` on entity-returning SDK method | Invalidation + refetch are part of the public method. |
| Failure after a destructive step | `finally` still attempts cleanup; cleanup failure fails the journey. |
| Parent gone, child remains | Not clean. Stable child removal is required. |

Do not intentionally trigger destructive failure branches outside an isolated demo environment.

## Portable TypeScript

Read **Portable TypeScript** bottom of the shell after a run: one client, authenticate once, public modules, cache invalidation, real `ToughLeafApiError` status/body, explicit cleanup. The `starter/` app rebuilds this path without Studio source or direct Laravel calls.
