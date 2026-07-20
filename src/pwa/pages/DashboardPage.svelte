<script>
  import { client } from '../lib/sdk.js';
  import { navigate } from '../lib/router.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonCard from '../components/skeleton/SkeletonCard.svelte';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';

  let loading = true;
  let error = '';
  let projects = [];
  let searchHistory = [];
  let user = null;
  let company = null;
  let features = null;
  let outreachCount = 0;

  async function loadDashboard() {
    loading = true;
    error = '';
    try {
      const [p, history, u, c] = await Promise.all([
        client.projects.list(undefined, { staleTime: 30_000 }).catch(() => []),
        client.companies.listSearchHistory({ limit: 5 }).catch(() => []),
        client.account.getUser().catch(() => null),
        client.account.getCompany().catch(() => null),
      ]);
      projects = p;
      searchHistory = history;
      user = u;
      company = c;

      client.env.getFeatures().then((f) => (features = f)).catch(() => {});

      for (const proj of projects.slice(0, 5)) {
        try {
          const surveys = await client.projects.listSurveys(proj.id, undefined, { staleTime: 60_000 });
          outreachCount += surveys.filter((s) =>
            s.invitation_status === 'invited' || s.workflow_step_id
          ).length;
        } catch {}
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load dashboard';
    } finally {
      loading = false;
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function isOverdue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date();
  }

  loadDashboard();
</script>

{#if loading}
  <div class="dashboard-grid">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
  <div class="detail-section-title">Recent Projects</div>
  <div class="detail-panel">
    <SkeletonTable rows={5} columns={3} />
  </div>
  <div class="list-view">
    <SkeletonList items={5} lines={2} />
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
      <div class="stat-value">{outreachCount}</div>
      <div class="stat-label">Outreach Pending</div>
    </div>

    <div class="stat-card" on:click={() => navigate('/lookup')} role="button" tabindex="0"
         on:keydown={(e) => e.key === 'Enter' && navigate('/lookup')}>
      <div class="stat-value">{searchHistory.length}</div>
      <div class="stat-label">Recent Searches</div>
    </div>
  </div>

  {#if projects.length > 0}
    <div class="detail-section-title">Recent Projects</div>
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Name</th><th>Due Date</th><th>State</th></tr></thead>
        <tbody>
          {#each projects.slice(0, 5) as project}
            <tr on:click={() => navigate('/projects')} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
              <td class="primary">{project.name ?? 'Untitled'}</td>
              <td class="secondary mono {isOverdue(project.bid_due_date) ? 'text-danger' : ''}">{formatDate(project.bid_due_date)}</td>
              <td>{#if project.state}<span class="badge">{project.state}</span>{:else}—{/if}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each projects.slice(0, 5) as project}
          <div class="list-item" on:click={() => navigate('/projects')} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
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

  {#if company}
    <div class="detail-section-title">Your Company</div>
    <div class="settings-card">
      <div class="settings-row"><div class="settings-row-label">Company</div><div class="settings-row-value">{company.company_name ?? '—'}</div></div>
      <div class="settings-row"><div class="settings-row-label">Company ID</div><div class="settings-row-value mono">{company.id}</div></div>
    </div>
  {/if}
{/if}
