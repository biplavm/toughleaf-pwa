import { createClient, type ProjectData, type BidPackageData, type CompanySearchData } from '@toughleaf/platform-sdk';

const client = createClient({ baseUrl: '/api/v1' });
const form = document.querySelector<HTMLFormElement>('#app-form')!;
const output = document.querySelector<HTMLElement>('#output')!;

const value = (id: string) => document.querySelector<HTMLInputElement>(`#${id}`)!.value.trim();

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  let project: ProjectData | undefined;
  let bidPackage: BidPackageData | undefined;
  let search: CompanySearchData | undefined;
  let participantId: number | undefined;
  const cleanup: string[] = [];
  try {
    output.textContent = 'Running public SDK workflow…';
    await client.login({ email: value('email'), password: value('password') });
    const workflow = await client.workflows.get(value('workflow'));
    const option = workflow.steps?.flatMap((step) => step.prompts ?? [])
      .flatMap((prompt) => prompt.options ?? [])
      .find((candidate) => candidate.label === 'Send invitation');
    if (!option) throw new Error('Selected workflow has no Send invitation option');

    project = await client.projects.createOrUpdate({
      name: value('project'),
      workflow_id: workflow.id,
      project_type: 'bid_procurement',
    });
    bidPackage = await client.projects.createOrUpdateBidPackage(project.id, { name: 'Electrical' });
    search = await client.companies.search({ states: ['NY'] }, { fresh: true });
    const participant = search.results.find((company) => company.company_name === value('firm'));
    if (!participant) throw new Error(`${value('firm')} is absent from search results`);
    participantId = participant.id;
    await client.projects.addParticipants(project.id, [{ company_id: participant.id, bid_package_ids: [bidPackage.id] }]);
    await client.projects.upsertSurvey(project.id, participant.id, {
      included_bid_packages: [{ bid_package_id: bidPackage.id, invitation_status: 'none' }],
    });
    const survey = await client.projects.updateSurveyWorkflow(project.id, participant.id, { workflow_option_id: option.id });
    output.textContent = JSON.stringify({ status: 'passed', project, bidPackage, participant, survey, cleanup: 'running' }, null, 2);
  } catch (error) {
    output.textContent = JSON.stringify({ status: 'failed', error: error instanceof Error ? error.message : String(error), cleanup: 'running' }, null, 2);
  } finally {
    if (project && participantId && bidPackage) {
      await client.projects.removeParticipants(project.id, [{ company_id: participantId, bid_package_ids: [bidPackage.id] }]);
      cleanup.push('participant');
    }
    if (project && bidPackage) {
      await client.projects.deleteBidPackage(project.id, bidPackage.id);
      cleanup.push('bid-package');
    }
    if (project) {
      await client.projects.delete(project.id);
      cleanup.push('project');
    }
    if (search) {
      await client.companies.deleteSearch(search.id);
      cleanup.push('company-search');
    }
    output.textContent += `\n\nCleanup: ${cleanup.join(', ') || 'nothing created'}`;
  }
});
