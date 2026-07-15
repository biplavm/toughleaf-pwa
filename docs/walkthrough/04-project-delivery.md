# 04 — Project delivery

TL-810 regression. Create a disposable project, full-read it, update after 204, manage a bid package, optionally assign a participant, and clean children before parents.

Prerequisites and API target: [README.md](README.md).

---

## Steps

### Step 1 — Sign in

Fill **Email** / **Password**. Click **Sign in**.

**Pass if:** `#session-status` is `SIGNED_IN`.

### Step 2 — Config

Fill **Workflow ULID** (`TL_DEMO_WORKFLOW_ID`). Fill **Participant company** (`TL_DEMO_PARTICIPANT_COMPANY_ID`) for the fullest path.

**Leave Client ID empty** unless you are using an admin account that requires it. Non-admin Owners must not send Client ID.

### Step 3 — Select journey

Click **Project delivery**.

### Step 4 — Run

Click **Run journey**. Wait for `#output` JSON to complete.

**Pass if:** `"status": "passed"`.

### Step 5 — Read evidence

Confirm:

1. Create disposable project.
2. Full project read (not only list representation).
3. Update name and observe refetched result.
4. Create Electrical bid package; update and observe refetch.
5. If configured: add participant and read participant list.
6. Remove participant survey state before deleting package and project.

**Pass if:** `#output` contains `"full_read": true` and `"bid_package_update_refetched": true`; cleanup entries are `cleaned`.

A deleted project is not accepted as proof that its children were cleaned.

### Step 6 — What would make it fail

Stale data after update, participant missing from read-back, active survey after removal, or any failed cleanup step.

---

## Playwright

```powershell
npx playwright test tests/e2e/studio.spec.js --grep "TL-810"
```

Requires `TL_DEMO_WORKFLOW_ID` and `TL_DEMO_PARTICIPANT_COMPANY_ID`. Asserts `"full_read": true` and `"bid_package_update_refetched": true`.
