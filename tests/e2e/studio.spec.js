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
    try { return JSON.parse(text).status === 'running' ? 'running' : 'complete'; } catch { return 'running'; }
  }, { timeout: 120_000 }).toBe('complete');
  const text = await page.locator('#output').textContent();
  expect(JSON.parse(text), text).toMatchObject({ status: 'passed' });
}

test('renders the three versioned journeys and contract inspector', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Build a real Tough Leaf frontend/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Account \+ company/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Team invites/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Project delivery/i })).toBeVisible();
  await expect(page.getByText('Live HTTP contract')).toBeVisible();
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
