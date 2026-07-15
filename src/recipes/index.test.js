import { describe, expect, it } from 'vitest';
import { RECIPES, runStep } from './index.js';

describe('Studio journey evidence', () => {
  it('records a passing step with duration', async () => {
    const steps = [];
    const value = await runStep(steps, 'contract check', async () => 42, {
      assertion: 'response is observable',
      invalidates: ['survey'],
      refetch: 'observed',
    });
    expect(value).toBe(42);
    expect(steps).toMatchObject([{ name: 'contract check', status: 'passed' }]);
    expect(steps[0].duration_ms).toBeGreaterThanOrEqual(0);
    expect(steps[0]).toMatchObject({
      assertion: 'response is observable',
      invalidates: ['survey'],
      refetch: 'observed',
    });
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

  it('resets and verifies the TL-810 survey before deleting its project', async () => {
    const calls = [];
    let participantRemoved = false;
    const client = {
      projects: {
        createOrUpdate: async (payload, id) => id
          ? { id, name: payload.name }
          : { id: 10, name: payload.name },
        get: async () => ({ id: 10 }),
        createOrUpdateBidPackage: async (projectId, payload, id) => ({
          id: id ?? 20,
          project_id: projectId,
          name: payload.name,
        }),
        addParticipants: async () => calls.push('add'),
        listParticipants: async () => [{ id: 30 }],
        upsertSurvey: async () => calls.push('reset'),
        removeParticipants: async () => {
          calls.push('remove');
          participantRemoved = true;
        },
        listSurveys: async () => participantRemoved
          ? []
          : [{ id: 'survey', company_id: 30, workflow_step_id: 'step' }],
        deleteBidPackage: async () => calls.push('delete-package'),
        delete: async () => calls.push('delete-project'),
      },
    };

    const context = /** @type {any} */ ({
      client,
      ensureSignedIn: async () => {},
      config: { workflowId: 'workflow', participantCompanyId: 30 },
    });
    const result = await RECIPES.projects.run(context);

    expect(result.status).toBe('passed');
    expect(calls).toEqual([
      'add',
      'reset',
      'reset',
      'remove',
      'delete-package',
      'delete-project',
    ]);
    expect(result.steps).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Stabilize and remove disposable participant', status: 'cleaned' }),
    ]));
  });
});
