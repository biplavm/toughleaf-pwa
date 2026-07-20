<script>
  import { client } from '../lib/sdk.js';
  import { auditReady } from '../lib/reporting.js';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import SkeletonDetail from '../components/skeleton/SkeletonDetail.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';
  import ProjectReport from '../components/ProjectReport.svelte';

  let view = 'list';
  let projects = [];
  let loading = true;
  let error = '';
  let projectSearch = '';

  let selectedProject = null;
  let projectData = null;
  let participants = [];
  let surveys = [];
  let projectLoading = false;
  let projectTab = 'overview';

  let selectedBidPackage = null;
  let bidPackageData = null;
  let bidPackageLoading = false;
  let bidPackageSearch = '';

  async function loadProjects() {
    loading = true;
    error = '';
    try {
      projects = await client.projects.list(undefined, { staleTime: 30_000 });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load projects';
    } finally {
      loading = false;
    }
  }

  async function openProject(id) {
    view = 'project';
    projectTab = 'overview';
    projectLoading = true;
    selectedProject = id;
    projectData = null;
    participants = [];
    surveys = [];
    error = '';
    try {
      const [full, parts, survs] = await Promise.all([
        client.projects.get(id, { full: true }),
        client.projects.listParticipants(id).catch(() => []),
        client.projects.listSurveys(id).catch(() => []),
      ]);
      projectData = full;
      participants = parts;
      surveys = survs;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load project';
    } finally {
      projectLoading = false;
    }
  }

  async function openBidPackage(pkgId) {
    view = 'bidPackage';
    bidPackageLoading = true;
    selectedBidPackage = pkgId;
    bidPackageData = null;
    error = '';
    try {
      bidPackageData = await client.projects.getBidPackage(selectedProject, pkgId);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load bid package';
    } finally {
      bidPackageLoading = false;
    }
  }

  function goToProjects() {
    view = 'list';
    selectedProject = null;
    projectData = null;
    participants = [];
    surveys = [];
    selectedBidPackage = null;
    bidPackageData = null;
    projectSearch = '';
    bidPackageSearch = '';
    projectTab = 'overview';
  }

  function goToProject() {
    view = 'project';
    selectedBidPackage = null;
    bidPackageData = null;
    bidPackageSearch = '';
  }

  function surveyStatus(s) {
    if (s.invitation_status === 'accepted' || s.workflow_step_id) return 'active';
    if (s.invitation_status === 'invited') return 'invited';
    return 'pending';
  }

  function workflowLabel(s) {
    if (s.workflow_step?.label) {
      const prompt = s.workflow_prompt?.label;
      return prompt ? `${s.workflow_step.label} — ${prompt}` : s.workflow_step.label;
    }
    return s.invitation_status ?? '—';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function formatCurrency(value) {
    if (value == null) return '—';
    return `$${Number(value).toLocaleString()}`;
  }

  function projectAuditBadge(p) {
    const pkgs = Array.isArray(p?.bid_packages) ? p.bid_packages : [];
    if (pkgs.length === 0) return { label: 'No packages', tone: 'muted' };
    const reqTypes = Array.isArray(p?.req_certification_types) ? p.req_certification_types : [];
    const allStarted = pkgs.every((pkg) => pkg?.outreach_status && pkg.outreach_status !== 'not_started');
    if (!allStarted) return { label: 'Outreach not started', tone: 'warn' };
    if (reqTypes.length === 0) return { label: 'No cert reqs', tone: 'muted' };
    return { label: 'In progress', tone: 'info' };
  }

  $: filteredProjects = projectSearch
    ? projects.filter((p) => {
        const q = projectSearch.toLowerCase();
        return (p.name ?? '').toLowerCase().includes(q)
          || (p.project_type ?? '').toLowerCase().includes(q)
          || (p.state ?? '').toLowerCase().includes(q);
      })
    : projects;

  $: filteredBidPackages = bidPackageSearch && projectData?.bid_packages
    ? projectData.bid_packages.filter((p) => {
        const q = bidPackageSearch.toLowerCase();
        return (p.name ?? '').toLowerCase().includes(q)
          || (p.scope ?? '').toLowerCase().includes(q);
      })
    : projectData?.bid_packages ?? [];

  loadProjects();
</script>

{#if view === 'list'}
  {#if loading}
    <div class="detail-panel">
      <SkeletonTable rows={6} columns={4} />
    </div>
    <div class="list-view">
      <SkeletonList items={5} lines={2} />
    </div>
  {:else if error}
    <div class="empty-state"><p class="empty-state-title">{error}</p></div>
  {:else if projects.length === 0}
    <div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
      <p class="empty-state-title">No projects yet</p>
      <p class="empty-state-desc">Projects will appear here once created.</p>
    </div>
  {:else}
    <div class="search-bar-row">
      <div class="search-input">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input type="text" bind:value={projectSearch} placeholder="Search projects" />
      </div>
    </div>

    {#if filteredProjects.length === 0}
      <div class="empty-state">
        <p class="empty-state-title">No projects match "{projectSearch}"</p>
      </div>
    {:else}
      <div class="detail-panel">
        <table class="data-table">
          <thead>
            <tr><th>Name</th><th>Type</th><th>Due Date</th><th>State</th><th>Status</th></tr>
          </thead>
          <tbody>
            {#each filteredProjects as project}
              {@const badge = projectAuditBadge(project)}
              <tr on:click={() => openProject(project.id)} role="button" tabindex="0"
                  on:keydown={(e) => e.key === 'Enter' && openProject(project.id)}>
                <td class="primary">{project.name ?? 'Untitled'}</td>
                <td class="secondary">{project.project_type ?? '—'}</td>
                <td class="secondary mono">{formatDate(project.bid_due_date)}</td>
                <td>{#if project.state}<span class="badge">{project.state}</span>{:else}—{/if}</td>
                <td><span class="badge badge-{badge.tone === 'warn' ? 'warning' : badge.tone === 'info' ? 'accent' : ''}">{badge.label}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>

        <div class="list-view">
          {#each filteredProjects as project}
            {@const badge = projectAuditBadge(project)}
            <div class="list-item" on:click={() => openProject(project.id)} role="button" tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && openProject(project.id)}>
              <div class="list-item-main">
                <div class="list-item-title">{project.name ?? 'Untitled'}</div>
                <div class="list-item-meta">
                  <span>{project.project_type ?? '—'}</span>
                  {#if project.bid_due_date}<span>Due {formatDate(project.bid_due_date)}</span>{/if}
                  <span class="badge badge-{badge.tone === 'warn' ? 'warning' : badge.tone === 'info' ? 'accent' : ''}">{badge.label}</span>
                </div>
              </div>
              {#if project.state}<span class="badge">{project.state}</span>{/if}
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}

{:else if view === 'project'}
  <div class="breadcrumb">
    <button class="breadcrumb-item" on:click={goToProjects}>Projects</button>
    <svg class="breadcrumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    <span class="breadcrumb-item active">{projectData?.name ?? 'Project'}</span>
  </div>

  {#if projectLoading}
    <div class="detail-panel">
      <div class="detail-panel-header"><SkeletonDetail rows={1} sections={1} /></div>
      <div class="detail-panel-body"><SkeletonDetail rows={4} sections={1} /></div>
    </div>
  {:else if projectData}
    <div class="project-tabs">
      <button class="project-tab" class:active={projectTab === 'overview'} on:click={() => (projectTab = 'overview')}>Overview</button>
      <button class="project-tab" class:active={projectTab === 'report'} on:click={() => (projectTab = 'report')}>Report</button>
    </div>

    {#if projectTab === 'report'}
      <ProjectReport project={projectData} {participants} {surveys} loading={false} />
    {:else}
    <div class="detail-panel">
      <div class="detail-panel-header">
        <div>
          <h2>{projectData.name ?? 'Untitled'}</h2>
          <div class="project-meta-row">
            {#if projectData.project_type}<span class="badge">{projectData.project_type}</span>{/if}
            {#if projectData.state}<span class="badge">{projectData.state}</span>{/if}
            {#if projectData.bid_due_date}<span class="badge badge-warning">Due {formatDate(projectData.bid_due_date)}</span>{/if}
          </div>
        </div>
      </div>
      <div class="detail-panel-body">
        <dl class="detail-grid">
          <dt>Project ID</dt><dd class="mono">{projectData.id}</dd>
          <dt>Type</dt><dd>{projectData.project_type ?? '—'}</dd>
          <dt>Location</dt><dd>{[projectData.city, projectData.state].filter(Boolean).join(', ') || '—'}</dd>
          <dt>Description</dt><dd>{projectData.description ?? '—'}</dd>
        </dl>
      </div>
    </div>

    {#if projectData.bid_packages?.length}
      <div class="detail-section-title">Bid Packages <span class="count">({filteredBidPackages.length})</span></div>

      {#if projectData.bid_packages.length > 3}
        <div class="search-bar-row" style="margin-bottom:var(--tl-spacing-md)">
          <div class="search-input">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" bind:value={bidPackageSearch} placeholder="Search bid packages" />
          </div>
        </div>
      {/if}

      {#if filteredBidPackages.length === 0}
        <div class="empty-state">
          <p class="empty-state-title">No bid packages match "{bidPackageSearch}"</p>
        </div>
      {:else}
        <div class="bid-package-grid">
          {#each filteredBidPackages as pkg}
            <div class="bid-package-card" on:click={() => openBidPackage(pkg.id)} role="button" tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && openBidPackage(pkg.id)}>
              <div class="bid-package-card-header">
                <span class="bid-package-name">{pkg.name ?? 'Unnamed'}</span>
                {#if pkg.published}
                  <span class="badge badge-success">Published</span>
                {:else}
                  <span class="badge">Draft</span>
                {/if}
              </div>
              <div class="bid-package-card-body">
                {#if pkg.scope}<div class="bid-package-scope">{pkg.scope}</div>{/if}
                <div class="bid-package-meta">
                  {#if pkg.bid_due_date}
                    <div class="bid-package-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span>{formatDate(pkg.bid_due_date)}</span>
                    </div>
                  {/if}
                  {#if pkg.approx_value != null}
                    <div class="bid-package-meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      <span>{formatCurrency(pkg.approx_value)}</span>
                    </div>
                  {/if}
                </div>
              </div>
              <div class="bid-package-card-footer">
                <span>View details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {:else}
      <div class="empty-state" style="margin-top:var(--tl-spacing-lg)">
        <p class="empty-state-title">No bid packages</p>
        <p class="empty-state-desc">Bid packages will appear here once created.</p>
      </div>
    {/if}

    {#if participants.length > 0}
      <div class="detail-section-title">Participants <span class="count">({participants.length})</span></div>
      <div class="detail-panel">
        <table class="data-table">
          <thead><tr><th>Company</th><th>ID</th></tr></thead>
          <tbody>
            {#each participants as p}
              <tr>
                <td class="primary">{p.company_name ?? p.company?.company_name ?? `Company ${p.company_id ?? p.id ?? '?'}`}</td>
                <td class="secondary mono">{p.company_id ?? p.id ?? '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="list-view">
          {#each participants as p}
            <div class="list-item">
              <div class="list-item-main">
                <div class="list-item-title">{p.company_name ?? p.company?.company_name ?? `Company ${p.company_id ?? p.id ?? '?'}`}</div>
                <div class="list-item-meta"><span>ID: {p.company_id ?? p.id ?? '—'}</span></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if surveys.length > 0}
      <div class="detail-section-title">Outreach &amp; Workflow <span class="count">({surveys.length})</span></div>
      <div class="detail-panel">
        <table class="data-table">
          <thead><tr><th>Company</th><th>Workflow Step</th><th>Status</th></tr></thead>
          <tbody>
            {#each surveys as s}
              <tr>
                <td class="primary">{s.participant?.company_name ?? `Company ${s.company_id}`}</td>
                <td class="secondary">{workflowLabel(s)}</td>
                <td><span class="badge badge-{surveyStatus(s) === 'active' ? 'success' : surveyStatus(s) === 'invited' ? 'accent' : ''}">{surveyStatus(s)}</span></td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="list-view">
          {#each surveys as s}
            <div class="list-item">
              <div class="list-item-main">
                <div class="list-item-title">{s.participant?.company_name ?? `Company ${s.company_id}`}</div>
                <div class="list-item-meta"><span>{workflowLabel(s)}</span></div>
              </div>
              <span class="badge badge-{surveyStatus(s) === 'active' ? 'success' : surveyStatus(s) === 'invited' ? 'accent' : ''}">{surveyStatus(s)}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <p class="muted-note">Editing and advanced actions are available on the desktop application.</p>
    {/if}
  {/if}

{:else if view === 'bidPackage'}
  <div class="breadcrumb">
    <button class="breadcrumb-item" on:click={goToProjects}>Projects</button>
    <svg class="breadcrumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    <button class="breadcrumb-item" on:click={goToProject}>{projectData?.name ?? 'Project'}</button>
    <svg class="breadcrumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    <span class="breadcrumb-item active">{bidPackageData?.name ?? 'Bid Package'}</span>
  </div>

  {#if bidPackageLoading}
    <div class="detail-panel">
      <div class="detail-panel-header"><SkeletonDetail rows={1} sections={1} /></div>
      <div class="detail-panel-body"><SkeletonDetail rows={6} sections={1} /></div>
    </div>
  {:else if bidPackageData}
    <div class="detail-panel">
      <div class="detail-panel-header">
        <div>
          <h2>{bidPackageData.name ?? 'Unnamed Package'}</h2>
          <div class="project-meta-row">
            {#if bidPackageData.published}<span class="badge badge-success">Published</span>{:else}<span class="badge">Draft</span>{/if}
            {#if bidPackageData.bid_due_date}<span class="badge badge-warning">Due {formatDate(bidPackageData.bid_due_date)}</span>{/if}
            {#if bidPackageData.approx_value != null}<span class="badge">{formatCurrency(bidPackageData.approx_value)}</span>{/if}
          </div>
        </div>
      </div>
      <div class="detail-panel-body">
        <dl class="detail-grid">
          <dt>Package ID</dt><dd class="mono">{bidPackageData.id}</dd>
          <dt>Scope</dt><dd>{bidPackageData.scope ?? '—'}</dd>
          <dt>Description</dt><dd>{bidPackageData.description ?? '—'}</dd>
          <dt>Due date</dt><dd>{formatDate(bidPackageData.bid_due_date)}</dd>
          <dt>Due time</dt><dd>{bidPackageData.bid_due_time ?? '—'}</dd>
          <dt>Timezone</dt><dd>{bidPackageData.bid_due_timezone ?? '—'}</dd>
          <dt>Approx. value</dt><dd class="mono">{formatCurrency(bidPackageData.approx_value)}</dd>
          <dt>Billing type</dt><dd>{bidPackageData.billing_type ?? '—'}</dd>
          <dt>Public</dt><dd>{bidPackageData.is_public ? 'Yes' : 'No'}</dd>
        </dl>
      </div>
    </div>
  {/if}
{/if}
