import { describe, expect, it } from 'vitest';
import { runStep } from './index.js';

describe('Studio journey evidence', () => {
  it('records a passing step with duration', async () => {
    const steps = [];
    const value = await runStep(steps, 'contract check', async () => 42);
    expect(value).toBe(42);
    expect(steps).toMatchObject([{ name: 'contract check', status: 'passed' }]);
    expect(steps[0].duration_ms).toBeGreaterThanOrEqual(0);
  });

  it('records a failed step and rethrows', async () => {
    const steps = [];
    await expect(
      runStep(steps, 'failing contract', async () => {
        throw new Error('Laravel 422');
      }),
    ).rejects.toThrow('Laravel 422');
    expect(steps).toMatchObject([
      { name: 'failing contract', status: 'failed', error: 'Laravel 422' },
    ]);
  });
});
