import { expect, test } from '@playwright/test';

const realEnv = Boolean(process.env.TL_DEMO_EMAIL && process.env.TL_DEMO_PASSWORD);

async function signIn(page) {
  await page.goto('/');
  await page.getByLabel('Email').fill(process.env.TL_DEMO_EMAIL);
  await page.getByLabel('Password').fill(process.env.TL_DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page.locator('#session-status')).toHaveText('SIGNED_IN', { timeout: 30_000 });
}

async function expectPassed(page) {
  await page.getByRole('button', { name: 'Run journey' }).click();
  await expect.poll(async () => {
    const text = await page.locator('#output').textContent();
    try {
      const result = JSON.parse(text);
      return Array.isArray(result.steps) || result.status === 'failed' ? 'complete' : 'running';
    } catch {
      return 'running';
    }
  }, { timeout: 120_000 }).toBe('complete');
  const text = await page.locator('#output').textContent();
  expect(JSON.parse(text), text).toMatchObject({ status: 'passed' });
}

test('renders the golden path, regressions, and contract inspector', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /GC project to outreach/i }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: /GC project to outreach/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Account \+ company/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Team invites/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Project delivery/i })).toBeVisible();
  await expect(page.getByText('HTTP contract inspector')).toBeVisible();
});

test('runs TL-876 GC project-to-outreach contract against Laravel', async ({ page }) => {
  test.skip(
    !realEnv || !process.env.TL_DEMO_WORKFLOW_ID || !process.env.TL_DEMO_PARTICIPANT_COMPANY_NAME,
    'Set demo credentials, workflow id, and exact participant company name',
  );
  await signIn(page);
  await page.getByLabel('Workflow ULID').fill(process.env.TL_DEMO_WORKFLOW_ID);
  await page.getByLabel('Firm name').fill(process.env.TL_DEMO_PARTICIPANT_COMPANY_NAME);
  await expectPassed(page);
  await expect(page.locator('#output')).toContainText('"http_status": 204');
  await expect(page.locator('#output')).toContainText('"name": "API zero-residue"');
  await expect(page.locator('#output')).toContainText('"status": "passed"');
  await expect(page.locator('#trace-list')).toContainText('204');
});

test('runs TL-808 account/company against Laravel', async ({ page }) => {
  test.skip(!realEnv, 'Set TL_DEMO_EMAIL and TL_DEMO_PASSWORD for the real Laravel gate');
  await signIn(page);
  await page.getByRole('button', { name: /Account \+ company/i }).click();
  await expectPassed(page);
  await expect(page.locator('#output')).toContainText('"observer_received_mutation": true');
});

test('runs TL-809 invite lifecycle against Laravel', async ({ page }) => {
  test.skip(!realEnv || !process.env.TL_DEMO_ROLE_ID, 'Set demo credentials and TL_DEMO_ROLE_ID');
  await signIn(page);
  await page.getByLabel('Invite role ID').fill(process.env.TL_DEMO_ROLE_ID);
  await page.getByRole('button', { name: /Team invites/i }).click();
  await expectPassed(page);
  await expect(page.locator('#output')).toContainText('"created_visible": true');
});

test('runs TL-810 project/package/participant lifecycle against Laravel', async ({ page }) => {
  test.skip(
    !realEnv || !process.env.TL_DEMO_WORKFLOW_ID || !process.env.TL_DEMO_PARTICIPANT_COMPANY_ID,
    'Set demo credentials, workflow id, and participant company id',
  );
  await signIn(page);
  await page.getByLabel('Workflow ULID').fill(process.env.TL_DEMO_WORKFLOW_ID);
  await page.getByLabel('Participant company').fill(process.env.TL_DEMO_PARTICIPANT_COMPANY_ID);
  if (process.env.TL_DEMO_CLIENT_ID) {
    await page.getByLabel('Client ID').fill(process.env.TL_DEMO_CLIENT_ID);
  }
  await page.getByRole('button', { name: /Project delivery/i }).click();
  await expectPassed(page);
  await expect(page.locator('#output')).toContainText('"full_read": true');
  await expect(page.locator('#output')).toContainText('"bid_package_update_refetched": true');
});
