# 03 — Team invites

TL-809 regression. List pending invitations, create a disposable invite, observe 204/refetch, resend, verify visibility, and delete the test invitation.

Prerequisites and API target: [README.md](README.md).

---

## Steps

### Step 1 — Sign in

Fill **Email** / **Password**. Click **Sign in**.

**Pass if:** `#session-status` is `SIGNED_IN`.

### Step 2 — Config

Fill **Invite role ID** from seeder or `TL_DEMO_ROLE_ID`. Do not commit this value.

**Pass if:** field shows a positive integer role id.

### Step 3 — Select journey

Click **Team invites**.

### Step 4 — Run

Click **Run journey**. Wait for `#output` JSON to complete.

**Pass if:** `"status": "passed"`.

### Step 5 — Read evidence

Watch for:

1. **List pending invites** before mutation.
2. **Create invite** with a unique disposable email.
3. Laravel empty-body mutation, then SDK-returned refetched invitation.
4. **Resend invite** with another observable refetch.
5. **Verify invalidated invite list** — created invitation visible.
6. **Delete disposable invite** and final list read proving it disappeared.

**Pass if:** `#output` contains `"created_visible": true` and delete cleanup is complete.

### Step 6 — What would make it fail

Invalid role, rejected permissions, missing invitation after refetch, or incomplete deletion.

---

## Playwright

```powershell
npx playwright test tests/e2e/studio.spec.js --grep "TL-809"
```

Requires `TL_DEMO_ROLE_ID`. Asserts `"created_visible": true`.
