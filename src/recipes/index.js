const DOC = 'https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/recipes';
const GUIDE = 'https://github.com/toughleaf/toughleaf-platform-sdk/blob/main/docs/guides';

/** @param {number} ms */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * @template T
 * @param {Array<Record<string, unknown>>} steps
 * @param {string} name
 * @param {() => Promise<T>} action
 * @returns {Promise<T>}
 */
export async function runStep(steps, name, action, evidence = {}) {
  const startedAt = performance.now();
  try {
    const value = await action();
    steps.push({ name, status: 'passed', duration_ms: Math.round(performance.now() - startedAt), ...evidence });
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
  await runStep(steps, name, action, { cleanup: true });
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
 * @property {string} participantCompanyName
 * @property {string} searchState
 *
 * @typedef {object} RecipeContext
 * @property {import('@toughleaf/platform-sdk').ToughLeafClient} client
 * @property {() => Promise<void>} ensureSignedIn
 * @property {JourneyConfig} config
 * @property {() => Array<Record<string, unknown>>} [getTrace]
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

async function removeParticipantSurvey(client, projectId, companyId, bidPackageId) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const before = await client.projects.listSurveys(projectId, undefined, { staleTime: 0 });
    const current = before.find((survey) => survey.company_id === companyId);
    if (!current) return { attempts: attempt - 1, stable: true };

    if (current.workflow_step_id) {
      for (let reset = 0; reset < 2; reset += 1) {
        await client.projects.upsertSurvey(projectId, companyId, {
          included_bid_packages: [{
            bid_package_id: bidPackageId,
            invitation_status: 'none',
            activity_status: 'none',
          }],
        });
      }
    }

    await client.projects.removeParticipants(projectId, [
      { company_id: companyId, bid_package_ids: [bidPackageId] },
    ]);
    await delay(750);
    const after = await client.projects.listSurveys(projectId, undefined, { staleTime: 0 });
    if (!after.some((survey) => survey.company_id === companyId)) {
      await delay(750);
      const stable = await client.projects.listSurveys(projectId, undefined, { staleTime: 0 });
      if (!stable.some((survey) => survey.company_id === companyId)) {
        return { attempts: attempt, stable: true };
      }
    }
  }
  throw new Error('Disposable project survey remains after four stabilized cleanup attempts');
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
      await runCleanup(steps, 'Stabilize and remove disposable participant', () =>
        removeParticipantSurvey(client, project.id, config.participantCompanyId, bidPackage.id),
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

/** @param {RecipeContext & {getTrace: () => Array<Record<string, unknown>>}} context */
async function goldenJourney({ client, ensureSignedIn, config, getTrace }) {
  await ensureSignedIn();
  assertContract(config.workflowId, 'Select a Laravel workflow before running the golden path');
  assertContract(config.participantCompanyName, 'Enter the exact company name to select from real search results');

  const steps = [];
  const cleanup = [];
  const runId = Date.now();
  const projectName = `Studio GC workflow ${runId}`;
  let project;
  let bidPackage;
  let search;
  let participant;
  let participantAdded = false;
  let result;
  let failure;

  try {
    const [company, workflow] = await runStep(steps, 'Preflight company and workflow', () => Promise.all([
      client.account.getCompany(),
      client.workflows.get(config.workflowId, { staleTime: 0 }),
    ]), {
      assertion: 'Authenticated company exists and selected workflow is readable',
      invalidates: [],
      refetch: 'not applicable',
    });
    assertContract(company.company_name, 'Authenticated company profile is incomplete');
    assertContract(workflow.id === config.workflowId, 'Laravel returned a different workflow');

    project = await runStep(steps, 'Create disposable project', () => client.projects.createOrUpdate({
      name: projectName,
      description: 'Disposable Studio GC workflow project',
      workflow_id: workflow.id,
      project_type: 'bid_procurement',
    }), {
      assertion: 'HTTP 201 and a new project id',
      invalidates: ['projects:list'],
      refetch: 'not required for 201 entity response',
    });

    bidPackage = await runStep(steps, 'Create bid package', () =>
      client.projects.createOrUpdateBidPackage(project.id, { name: `Electrical ${runId}` }), {
      assertion: 'HTTP 201 and package belongs to the project',
      invalidates: ['projects:list', 'project', 'project:full', 'bid-package'],
      refetch: 'not required for 201 entity response',
    });

    search = await runStep(steps, 'Search real firms', () => client.companies.search({ states: [config.searchState] }, { fresh: true }), {
      assertion: `Search returns the configured company in ${config.searchState}`,
      invalidates: ['companies:search-history'],
      refetch: 'GET search results after POST search',
    });
    participant = search.results.find((companyResult) => companyResult.company_name === config.participantCompanyName);
    assertContract(participant, `${config.participantCompanyName} is absent from ${search.results.length} search results`);

    await runStep(steps, 'Remove and restore firm feedback', async () => {
      await client.companies.saveFeedback(search.id, participant.id, { score: -1, failure_criteria: { demo_review: true } });
      const removed = await client.companies.getSearchResults(search.id, { staleTime: 0 });
      assertContract(removed.results_feedback.some((item) => item.matched_company_id === participant.id && item.score === -1), 'Removed feedback was not observed');
      await client.companies.clearFeedback(search.id, participant.id);
      const restored = await client.companies.getSearchResults(search.id, { staleTime: 0 });
      assertContract(!restored.results_feedback.some((item) => item.matched_company_id === participant.id), 'Restored firm remains marked as removed');
    }, {
      assertion: 'Remove is observable and restore removes the feedback marker',
      invalidates: ['companies:search-results'],
      refetch: 'observed after each 201 feedback response',
    });

    await runStep(steps, 'Select firm as participant', () => client.projects.addParticipants(project.id, [{
      company_id: participant.id,
      bid_package_ids: [bidPackage.id],
    }]), {
      assertion: 'HTTP 204 from participant mutation',
      invalidates: ['project', 'project:full', 'participants', 'surveys'],
      refetch: 'participant list read in the next step',
    });
    participantAdded = true;
    const participants = await runStep(steps, 'Observe participant refetch', () => client.projects.listParticipants(project.id, { staleTime: 0 }), {
      assertion: 'Selected company is present after invalidation',
      invalidates: [],
      refetch: 'observed',
    });
    assertContract(participants.some((item) => item.id === participant.id), 'Selected participant is absent after refetch');

    const survey = await runStep(steps, 'Upsert survey and package scope', () => client.projects.upsertSurvey(project.id, participant.id, {
      included_bid_packages: [{ bid_package_id: bidPackage.id, invitation_status: 'none' }],
    }), {
      assertion: 'Survey is returned with Laravel-initialized workflow state',
      invalidates: ['surveys', 'survey', 'participants', 'project:full'],
      refetch: 'entity returned by Laravel',
    });
    assertContract(survey.workflow_step_id && survey.workflow_prompt_id, 'Survey has no initialized workflow decision');

    const transitioned = await runStep(steps, 'Choose Send invitation', () => client.projects.updateSurveyWorkflow(
      project.id,
      participant.id,
      { workflow_option_id: findSendInvitationOption(workflow) },
    ), {
      assertion: 'Laravel returns 204 and SDK refetches the survey',
      invalidates: ['surveys', 'survey', 'participants', 'project:full'],
      refetch: 'observed GET survey after 204',
    });
    const workflowTrace = [...getTrace()].reverse().find((item) => String(item.path ?? '').endsWith(`/projects/${project.id}/surveys/${participant.id}/workflow`));
    assertContract(workflowTrace?.status === 204, `Expected workflow HTTP 204, observed ${workflowTrace?.status ?? 'no request'}`);
    assertContract(transitioned.id === survey.id, 'Survey refetch returned a different entity');

    result = {
      status: 'passed',
      project: { id: project.id, name: project.name },
      bid_package: { id: bidPackage.id, name: bidPackage.name },
      firm: { id: participant.id, name: participant.company_name, result_count: search.results.length },
      outreach: {
        status: 'accepted-by-laravel',
        http_status: 204,
        external_delivery: 'Verify recipient and subject in Mailpit outside Studio',
      },
    };
  } catch (error) {
    failure = error;
  } finally {
    const actions = [];
    if (participantAdded && project && participant && bidPackage) {
      actions.push(['Prepare participant cleanup', async () => {
        const currentSurvey = await client.projects.getSurvey(project.id, participant.id, { staleTime: 0 });
        if (currentSurvey.workflow_step_id) {
          for (let attempt = 0; attempt < 2; attempt += 1) {
            await client.projects.upsertSurvey(project.id, participant.id, {
              included_bid_packages: [{
                bid_package_id: bidPackage.id,
                invitation_status: 'none',
                activity_status: 'none',
              }],
            });
          }
        }
      }]);
      actions.push(['Remove participant and survey', async () => {
        await client.projects.removeParticipants(project.id, [{ company_id: participant.id, bid_package_ids: [bidPackage.id] }]);
        const surveys = await client.projects.listSurveys(project.id, undefined, { staleTime: 0 });
        assertContract(!surveys.some((item) => item.company_id === participant.id), 'Disposable survey remains after participant cleanup');
      }]);
    }
    if (project && bidPackage) actions.push(['Delete bid package', () => client.projects.deleteBidPackage(project.id, bidPackage.id)]);
    if (project) actions.push(['Delete project', () => client.projects.delete(project.id)]);
    if (search) actions.push(['Delete company search', () => client.companies.deleteSearch(search.id)]);
    for (const [name, action] of actions) {
      try {
        await runCleanup(steps, name, action);
        cleanup.push({ name, status: 'cleaned' });
      } catch (error) {
        cleanup.push({ name, status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    }
    if (project || search) {
      try {
        const [projects, searches] = await Promise.all([
          client.projects.list(undefined, { staleTime: 0 }),
          client.companies.listSearchHistory({ all: true }, { staleTime: 0 }),
        ]);
        const zeroResidue = (!project || !projects.some((item) => item.id === project.id))
          && (!search || !searches.some((item) => item.id === search.id));
        cleanup.push({ name: 'API zero-residue', status: zeroResidue ? 'passed' : 'failed' });
      } catch (error) {
        cleanup.push({ name: 'API zero-residue', status: 'failed', error: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  const cleanupFailed = cleanup.some((item) => item.status === 'failed');
  if (failure || cleanupFailed) {
    const error = Object.assign(
      failure instanceof Error ? failure : new Error('Golden path cleanup incomplete'),
      { journeySteps: steps, cleanup },
    );
    throw error;
  }
  return { ...result, steps, cleanup };
}

function findSendInvitationOption(workflow) {
  for (const workflowStep of workflow.steps ?? []) {
    for (const prompt of workflowStep.prompts ?? []) {
      const option = (prompt.options ?? []).find((item) => item.label === 'Send invitation');
      if (option) return option.id;
    }
  }
  throw new Error('Selected workflow has no "Send invitation" option');
}

export const RECIPES = {
  golden: {
    title: 'GC project to outreach',
    ticket: 'TL-876 / TL-878',
    desc: 'Project, package, firm search, participant, survey, workflow transition, and deterministic API cleanup.',
    doc: `${GUIDE}/gc-project-workflow.md`,
    code: `const project = await client.projects.createOrUpdate({ name, workflow_id });
const pkg = await client.projects.createOrUpdateBidPackage(project.id, { name: packageName });
const search = await client.companies.search({ states: ['NY'] });
const firm = search.results.find(({ company_name }) => company_name === selectedCompany);
await client.projects.addParticipants(project.id, [{ company_id: firm.id, bid_package_ids: [pkg.id] }]);
await client.projects.upsertSurvey(project.id, firm.id, {
  included_bid_packages: [{ bid_package_id: pkg.id, invitation_status: 'none' }],
});
await client.projects.updateSurveyWorkflow(project.id, firm.id, { workflow_option_id });`,
    run: goldenJourney,
  },
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
