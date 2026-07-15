# 02 — Account + company

TL-808 regression. Prove the shared SDK client can load the session user, mutate profile data, observe cache invalidation, read the company, and restore the original account.

Prerequisites and API target: [README.md](README.md).

---

## Steps

### Step 1 — Sign in

Fill **Email** / **Password** from seeder or `TL_DEMO_*`. Click **Sign in**.

**Pass if:** `#session-status` is `SIGNED_IN`.

### Step 2 — Select journey

Click **Account + company**.

**Pass if:** recipe title and Portable TypeScript update for this journey.

### Step 3 — Run

Click **Run journey**. Wait for `#output` JSON to complete.

**Pass if:** `"status": "passed"`.

### Step 4 — Read evidence

In **Journey result**, confirm this order:

1. **Load current user** — original state.
2. **Update user and invalidate shared cache** — mutation; observer receives the new first name.
3. **Load company through SDK** — same client continues into company-scoped work.
4. **Restore original user** — marked `cleaned`.

In **HTTP contract inspector**, open the mutation and confirm invalidation + observed refetch.

**Pass if:** `#output` contains `"observer_received_mutation": true` and restore is `cleaned`.

### Step 5 — What would make it fail

Observer never sees the mutation, company cannot be read, or original profile cannot be restored.

---

## Playwright

```powershell
npx playwright test tests/e2e/studio.spec.js --grep "TL-808"
```

Asserts `"observer_received_mutation": true` after `status: 'passed'`.
