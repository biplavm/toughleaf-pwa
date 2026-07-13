const DOC = 'https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes';

/** @param {number} ms */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @template T
 * @param {Array<Record<string, unknown>>} steps
 * @param {string} name
 * @param {() => Promise<T>} action
 * @returns {Promise<T>}
 */
export async function runStep(steps, name, action) {
  const startedAt = performance.now();
  try {
    const value = await action();
    steps.push({ name, status: 'passed', duration_ms: Math.round(performance.now() - startedAt) });
    return value;
  } catch (error) {
    steps.push({
      name,
      status: 'failed',
      duration_ms: Math.round(performance.now() - startedAt),
      error: error instanceof Error ? error.message : String(error),
    });
    if (error && typeof error === 'object') error.journeySteps = steps;
    throw error;
  }
}

async function runCleanup(steps, name, action) {
  await runStep(steps, name, action);
  steps.at(-1).status = 'cleaned';
}

function assertContract(condition, message) {
  if (!condition) throw new Error(message);
}

/**
 * @param {() => boolean | Promise<boolean>} predicate
 * @param {number} [timeout]
 */
async function waitFor(predicate, timeout = 30_000) {
  const deadline = Date.now() + timeout;
  while (!(await predicate())) {
    if (Date.now() >= deadline) throw new Error(`Timed out after ${timeout}ms`);
    await delay(50);
  }
}

/** @param {string} prefix */
function uniqueEmail(prefix) {
  return `${prefix}-${Date.now()}@example.com`;
}

/**
 * @typedef {object} JourneyConfig
 * @property {number} roleId
 * @property {string} inviteFirstName
 * @property {string} inviteLastName
 * @property {number | undefined} participantCompanyId
 * @property {string | undefined} workflowId
 * @property {number | undefined} clientId
 *
 * @typedef {object} RecipeContext
 * @property {import('@toughleaf/platform-sdk').ToughLeafClient} client
 * @property {() => Promise<void>} ensureSignedIn
 * @property {JourneyConfig} config
 */

/** @param {RecipeContext} context */
async function accountJourney({ client, ensureSignedIn }) {
  await ensureSignedIn();
  const steps = [];
  const original = await runStep(steps, 'Load current user', () => client.account.getUser());
  const temporaryName = `SDK${String(Date.now()).slice(-8)}`;
  let observedName;
  const subscription = client.account.observeUser().subscribe((state) => {
    if (state.data?.first_name) observedName = state.data.first_name;
  });

  try {
    await runStep(steps, 'Update user and invalidate shared cache', async () => {
      await client.account.updateUser({ first_name: temporaryName });
      await waitFor(() => observedName === temporaryName);
      return observedName;
    });
    const company = await runStep(steps, 'Load company through SDK', () => client.account.getCompany());
    return {
      status: 'passed',
      steps,
      assertions: { observer_received_mutation: observedName === temporaryName },
      user: { id: original.id, email: original.email },
      company: { id: company.id, company_name: company.company_name },
    };
  } finally {
    subscription.unsubscribe();
    await runCleanup(steps, 'Restore original user', () =>
      client.account.updateUser({ first_name: original.first_name }),
    );
  }
}

/** @param {RecipeContext} context */
async function invitesJourney({ client, ensureSignedIn, config }) {
  await ensureSignedIn();
  if (!Number.isInteger(config.roleId) || config.roleId <= 0) {
    throw new Error('Set a valid Laravel role id in Demo configuration');
  }
  const steps = [];
  const email = uniqueEmail('studio-invite');
  let invite;
  try {
    const before = await runStep(steps, 'List pending invites', () => client.invites.list());
    invite = await runStep(steps, 'Create invite (Laravel 204 + SDK refetch)', () =>
      client.invites.create({
        email,
        first_name: config.inviteFirstName,
        last_name: config.inviteLastName,
        role_id: config.roleId,
      }),
    );
    invite = await runStep(steps, 'Resend invite (Laravel 204 + SDK refetch)', () =>
      client.invites.resend(invite.id),
    );
    const after = await runStep(steps, 'Verify invalidated invite list', async () => {
      const current = await client.invites.list();
      assertContract(current.some((item) => item.id === invite.id), 'Created invite is absent after invalidation/refetch');
      return current;
    });
    return {
      status: 'passed',
      steps,
      assertions: {
        created_visible: after.some((item) => item.id === invite.id),
        count_delta: after.length - before.length,
      },
      invite: { id: invite.id, email: invite.email, status: invite.status },
    };
  } finally {
    if (invite?.id !== undefined) {
      await runCleanup(steps, 'Delete disposable invite', async () => {
        await client.invites.delete(invite.id);
        await waitFor(async () => {
          const remaining = await client.invites.list();
          return !remaining.some((item) => item.id === invite.id);
        });
      });
    }
  }
}

/** @param {RecipeContext} context */
async function projectsJourney({ client, ensureSignedIn, config }) {
  await ensureSignedIn();
  const steps = [];
  let project;
  let bidPackage;
  let participantAdded = false;
  const projectPayload = {
    name: `Studio Project ${Date.now()}`,
    ...(config.workflowId ? { workflow_id: config.workflowId } : {}),
    ...(config.clientId ? { client_id: config.clientId } : {}),
  };

  try {
    project = await runStep(steps, 'Create project', () => client.projects.createOrUpdate(projectPayload));
    const full = await runStep(steps, 'Read full project', async () => {
      const value = await client.projects.get(project.id, { full: true });
      assertContract(value.id === project.id, 'Full project read returned a different project');
      return value;
    });
    project = await runStep(steps, 'Update project (Laravel 204 + SDK refetch)', () =>
      client.projects.createOrUpdate({ name: `${project.name ?? projectPayload.name} Updated` }, project.id),
    );
    assertContract(String(project.name).endsWith('Updated'), 'Project update refetch returned stale data');
    bidPackage = await runStep(steps, 'Create bid package', () =>
      client.projects.createOrUpdateBidPackage(project.id, { name: 'Electrical' }),
    );
    bidPackage = await runStep(steps, 'Update bid package (Laravel 204 + SDK refetch)', () =>
      client.projects.createOrUpdateBidPackage(project.id, { name: 'Electrical Updated' }, bidPackage.id),
    );
    assertContract(bidPackage.name === 'Electrical Updated', 'Bid-package update refetch returned stale data');

    if (config.participantCompanyId) {
      await runStep(steps, 'Add participant', () =>
        client.projects.addParticipants(project.id, [
          { company_id: config.participantCompanyId, bid_package_ids: [bidPackage.id] },
        ]),
      );
      participantAdded = true;
      await runStep(steps, 'Verify participant list', () => client.projects.listParticipants(project.id));
    } else {
      steps.push({ name: 'Participant lifecycle', status: 'skipped', reason: 'No participant company id configured' });
    }

    return {
      status: 'passed',
      steps,
      assertions: {
        full_read: full.id === project.id,
        project_update_refetched: String(project.name).endsWith('Updated'),
        bid_package_update_refetched: bidPackage.name === 'Electrical Updated',
      },
      project: { id: project.id, name: project.name },
      bid_package: { id: bidPackage.id, name: bidPackage.name },
    };
  } finally {
    if (participantAdded && project && bidPackage && config.participantCompanyId) {
      await runCleanup(steps, 'Remove disposable participant', () =>
        client.projects.removeParticipants(project.id, [
          { company_id: config.participantCompanyId, bid_package_ids: [bidPackage.id] },
        ]),
      );
    }
    if (project && bidPackage) {
      await runCleanup(steps, 'Delete disposable bid package', () =>
        client.projects.deleteBidPackage(project.id, bidPackage.id),
      );
    }
    if (project) {
      await runCleanup(steps, 'Delete disposable project', () => client.projects.delete(project.id));
    }
  }
}

export const RECIPES = {
  account: {
    title: 'Account + company',
    ticket: 'TL-808',
    desc: 'One client, one cache: mutate, observe, verify, and restore.',
    doc: `${DOC}/account-profile-update.md`,
    code: `const sub = client.account.observeUser().subscribe(renderUser);
await client.account.updateUser({ first_name: nextName });
// The same client refetches and emits through the shared cache.`,
    run: accountJourney,
  },
  invites: {
    title: 'Team invite lifecycle',
    ticket: 'TL-809',
    desc: 'Create, refetch, resend, verify, and delete a disposable invitation.',
    doc: `${DOC}/team-invites.md`,
    code: `const invite = await client.invites.create({
  email, first_name, last_name, role_id
});
await client.invites.resend(invite.id);
await client.invites.delete(invite.id);`,
    run: invitesJourney,
  },
  projects: {
    title: 'Project delivery lifecycle',
    ticket: 'TL-810',
    desc: 'Project, full read, package, optional participant, and deterministic cleanup.',
    doc: `${DOC}/projects-lifecycle.md`,
    code: `const project = await client.projects.createOrUpdate({ name, workflow_id });
const pkg = await client.projects.createOrUpdateBidPackage(project.id, { name: 'Electrical' });
await client.projects.addParticipants(project.id, [{ company_id, bid_package_ids: [pkg.id] }]);`,
    run: projectsJourney,
  },
};
