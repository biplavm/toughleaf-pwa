<script>
  import { client } from '../lib/sdk.js';
  import { navigate } from '../lib/router.js';
  import { actionRequiredSurveys, approachingDeadlines } from '../lib/reporting.js';
  import SkeletonCard from '../components/skeleton/SkeletonCard.svelte';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';

  let loading = true;
  let error = '';
  let projects = [];
  let searchHistory = [];
  let user = null;

  let actionItems = [];
  let actionLoading = false;
  let actionLoaded = 0;

  let deadlines = [];

  async function loadDashboard() {
    loading = true;
    error = '';
    try {
      const [p, history, u] = await Promise.all([
        client.projects.list(undefined, { staleTime: 30_000 }).catch(() => []),
        client.companies.listSearchHistory({ limit: 5 }).catch(() => []),
        client.account.getUser().catch(() => null),
      ]);
      projects = p;
      searchHistory = history;
      user = u;

      deadlines = approachingDeadlines(projects, 14);

      loadActionItems(projects);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load dashboard';
    } finally {
      loading = false;
    }
  }

  async function loadActionItems(projectList) {
    actionLoading = true;
    const allSurveys = [];
    for (const proj of projectList) {
      try {
        const surveys = await client.projects.listSurveys(proj.id, undefined, { staleTime: 60_000 });
        for (const s of surveys) {
          allSurveys.push({ ...s, project_name: proj.name, project_id: proj.id });
        }
        actionLoaded++;
        actionItems = actionRequiredSurveys(allSurveys).slice(0, 8);
      } catch {}
    }
    actionItems = actionRequiredSurveys(allSurveys).slice(0, 8);
    actionLoading = false;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  function openProject(id) {
    navigate(`/projects?id=${id}`);
  }

  loadDashboard();
</script>

{#if loading}
  <div class="dashboard-grid">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
  <div class="detail-section-title">Action Required</div>
  <div class="detail-panel">
    <SkeletonTable rows={4} columns={3} />
  </div>
  <div class="list-view">
    <SkeletonList items={4} lines={2} />
  </div>
{:else if error}
  <div class="empty-state"><p class="empty-state-title">{error}</p></div>
{:else}
  <div style="font-size:var(--tl-font-size-lg);font-weight:var(--tl-font-weight-semibold);color:var(--tl-color-brand-hover);margin-bottom:var(--tl-spacing-lg)">
    Welcome back{#if user?.first_name}, {user.first_name}{/if}
  </div>

  <div class="dashboard-grid">
    <div class="stat-card" on:click={() => navigate('/projects')} role="button" tabindex="0"
         on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
      <div class="stat-value">{projects.length}</div>
      <div class="stat-label">Active Projects</div>
    </div>

    <div class="stat-card" on:click={() => navigate('/outreach')} role="button" tabindex="0"
         on:keydown={(e) => e.key === 'Enter' && navigate('/outreach')}>
      <div class="stat-value">{actionItems.length}{#if actionLoading}<span class="stat-loading">…</span>{/if}</div>
      <div class="stat-label">Action Required</div>
    </div>

    <div class="stat-card" on:click={() => navigate('/reports')} role="button" tabindex="0"
         on:keydown={(e) => e.key === 'Enter' && navigate('/reports')}>
      <div class="stat-value">{deadlines.length}</div>
      <div class="stat-label">Due &lt; 14 Days</div>
    </div>
  </div>

  {#if actionItems.length > 0}
    <div class="detail-section-title">Action Required</div>
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Company</th><th>Project</th><th>Step</th><th>Due</th></tr></thead>
        <tbody>
          {#each actionItems as item}
            <tr on:click={() => openProject(item.projectId)} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && openProject(item.projectId)}>
              <td class="primary">{item.companyName}</td>
              <td class="secondary">{item.projectName}</td>
              <td class="secondary">{item.workflowLabel}</td>
              <td class="secondary mono {item.overdue ? 'text-danger' : ''}">{formatDate(item.dueDate)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each actionItems as item}
          <div class="list-item" on:click={() => openProject(item.projectId)} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && openProject(item.projectId)}>
            <div class="list-item-main">
              <div class="list-item-title">{item.companyName}</div>
              <div class="list-item-meta">
                <span>{item.projectName}</span>
                <span>{item.workflowLabel}</span>
                <span class="{item.overdue ? 'text-danger' : ''}">Due {formatDate(item.dueDate)}</span>
              </div>
            </div>
            {#if item.overdue}<span class="badge badge-warning">Overdue</span>{/if}
          </div>
        {/each}
      </div>
    </div>
  {:else if actionLoading}
    <div class="detail-section-title">Action Required</div>
    <p class="muted-note">Checking outreach across {projects.length} projects…</p>
  {:else}
    <div class="detail-section-title">Action Required</div>
    <div class="empty-state" style="padding:var(--tl-spacing-lg)">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p class="empty-state-title">All caught up</p>
      <p class="empty-state-desc">No outreach items need your attention right now.</p>
    </div>
  {/if}

  {#if deadlines.length > 0}
    <div class="detail-section-title">Approaching Deadlines</div>
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Project</th><th>Due Date</th><th>Days Left</th></tr></thead>
        <tbody>
          {#each deadlines as d}
            <tr on:click={() => openProject(d.project.id)} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && openProject(d.project.id)}>
              <td class="primary">{d.project.name ?? 'Untitled'}</td>
              <td class="secondary mono">{formatDate(d.dueDate)}</td>
              <td class="secondary">{d.daysLeft}d</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each deadlines as d}
          <div class="list-item" on:click={() => openProject(d.project.id)} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && openProject(d.project.id)}>
            <div class="list-item-main">
              <div class="list-item-title">{d.project.name ?? 'Untitled'}</div>
              <div class="list-item-meta"><span>Due {formatDate(d.dueDate)}</span></div>
            </div>
            <span class="badge badge-warning">{d.daysLeft}d left</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if projects.length > 0}
    <div class="detail-section-title">Recent Projects</div>
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Due Date</th><th>State</th></tr></thead>
        <tbody>
          {#each projects.slice(0, 5) as project}
            <tr on:click={() => openProject(project.id)} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && openProject(project.id)}>
              <td class="primary">{project.name ?? 'Untitled'}</td>
              <td class="secondary mono {isOverdue(project.bid_due_date) ? 'text-danger' : ''}">{formatDate(project.bid_due_date)}</td>
              <td>{#if project.state}<span class="badge">{project.state}</span>{:else}—{/if}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each projects.slice(0, 5) as project}
          <div class="list-item" on:click={() => openProject(project.id)} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && openProject(project.id)}>
            <div class="list-item-main">
              <div class="list-item-title">{project.name ?? 'Untitled'}</div>
              <div class="list-item-meta">
                <span>Due {formatDate(project.bid_due_date)}</span>
                {#if project.state}<span>{project.state}</span>{/if}
              </div>
            </div>
            {#if isOverdue(project.bid_due_date)}<span class="badge badge-warning">Overdue</span>{/if}
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if searchHistory.length > 0}
    <div class="detail-section-title">Recent Firm Searches</div>
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Filter</th><th>Results</th><th>Date</th></tr></thead>
        <tbody>
          {#each searchHistory as hist}
            <tr on:click={() => navigate('/lookup')} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && navigate('/lookup')}>
              <td class="primary">{hist.filter?.keyword || hist.filter?.states?.join(', ') || 'Search ' + hist.id.slice(-6)}</td>
              <td class="secondary mono">{hist.results_count ?? hist.results?.length ?? '—'}</td>
              <td class="secondary">{hist.created_at ? formatDate(hist.created_at) : '—'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each searchHistory as hist}
          <div class="list-item" on:click={() => navigate('/lookup')} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && navigate('/lookup')}>
            <div class="list-item-main">
              <div class="list-item-title">{hist.filter?.keyword || hist.filter?.states?.join(', ') || 'Search ' + hist.id.slice(-6)}</div>
              <div class="list-item-meta">
                <span>{hist.results_count ?? hist.results?.length ?? '—'} results</span>
                {#if hist.created_at}<span>{formatDate(hist.created_at)}</span>{/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
{/if}

<style>
  .stat-loading {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-400);
  }
</style>
