<script>
  import { client } from '../lib/sdk.js';
  import { navigate } from '../lib/router.js';
  import { crossProjectMetrics } from '../lib/reporting.js';
  import SkeletonCard from '../components/skeleton/SkeletonCard.svelte';

  let loading = true;
  let error = '';
  let projects = [];
  let projectResults = [];
  let loadedCount = 0;
  let deadlineRange = 14;

  async function loadReports() {
    loading = true;
    error = '';
    projectResults = [];
    loadedCount = 0;
    try {
      projects = await client.projects.list(undefined, { staleTime: 30_000 });
      loading = false;

      for (const proj of projects) {
        try {
          const [full, parts, survs] = await Promise.all([
            client.projects.get(proj.id, { full: true }),
            client.projects.listParticipants(proj.id).catch(() => []),
            client.projects.listSurveys(proj.id).catch(() => []),
          ]);
          projectResults = [...projectResults, { project: full, participants: parts, surveys: survs }];
        } catch {
          projectResults = [...projectResults, { project: proj, participants: [], surveys: [] }];
        }
        loadedCount++;
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load reports';
      loading = false;
    }
  }

  $: metrics = crossProjectMetrics(projectResults);

  function formatCurrency(v) {
    if (v == null) return '—';
    if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
    if (v >= 1000) return `$${Math.round(v / 1000)}K`;
    return `$${Number(v).toLocaleString()}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff : null;
  }

  const outreachStatusLabels = {
    not_started: 'Not Started',
    filling_package: 'Filling Package',
    in_progress: 'In Progress',
    closed: 'Closed',
  };

  $: deadlineProjects = deadlineRange === 7 ? metrics.deadlineBuckets.days7
    : deadlineRange === 14 ? metrics.deadlineBuckets.days14
    : metrics.deadlineBuckets.days30;

  loadReports();
</script>

{#if loading}
  <div class="dashboard-grid">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
{:else if error}
  <div class="empty-state"><p class="empty-state-title">{error}</p></div>
{:else}
  <div class="reports-progress">
    Showing data for {loadedCount} of {projects.length} projects
    {#if loadedCount < projects.length}
      <span class="reports-progress-spinner"></span>
    {/if}
  </div>

  <div class="dashboard-grid">
    <div class="stat-card">
      <div class="stat-value">{metrics.activeProjects}</div>
      <div class="stat-label">Active Projects</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{metrics.totalFirms}</div>
      <div class="stat-label">Firms Engaged</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{formatCurrency(metrics.totalAwarded)}</div>
      <div class="stat-label">Total Awarded</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{metrics.diversePercent != null ? `${metrics.diversePercent}%` : '—'}</div>
      <div class="stat-label">Diverse Share</div>
    </div>
  </div>

  {#if !metrics.hasAwardData && loadedCount === projects.length}
    <p class="muted-note">No awards recorded yet across your projects. Awarded dollar figures will appear once bid packages are awarded.</p>
  {/if}

  {#if Object.keys(metrics.outreachStatusCounts).length > 0}
    <div class="detail-section-title">Outreach Status Distribution</div>
    <div class="report-section">
      {#each Object.entries(outreachStatusLabels) as [key, label]}
        {@const count = metrics.outreachStatusCounts[key] ?? 0}
        {@const total = Object.values(metrics.outreachStatusCounts).reduce((a, b) => a + b, 0)}
        {@const width = total > 0 ? Math.round((count / total) * 100) : 0}
        <div class="dist-row">
          <span class="dist-label">{label}</span>
          <div class="dist-track">
            <div class="dist-bar dist-{key}" style="width:{width}%">{#if width > 15}{count}{/if}</div>
          </div>
          <span class="dist-count">{count}</span>
        </div>
      {/each}
    </div>
  {/if}

  <div class="detail-section-title">Approaching Deadlines</div>
  <div class="deadline-range-toggle">
    {#each [7, 14, 30] as days}
      <button class="deadline-range-btn" class:active={deadlineRange === days} on:click={() => (deadlineRange = days)}>
        {days} days
      </button>
    {/each}
  </div>

  {#if deadlineProjects.length === 0}
    <div class="empty-state">
      <p class="empty-state-title">No deadlines in the next {deadlineRange} days</p>
    </div>
  {:else}
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Project</th><th>Due Date</th><th>Days Left</th></tr></thead>
        <tbody>
          {#each deadlineProjects as proj}
            <tr on:click={() => navigate('/projects')} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
              <td class="primary">{proj.name ?? 'Untitled'}</td>
              <td class="secondary mono">{formatDate(proj.bid_due_date)}</td>
              <td class="secondary">{daysUntil(proj.bid_due_date)}d</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each deadlineProjects as proj}
          <div class="list-item" on:click={() => navigate('/projects')} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
            <div class="list-item-main">
              <div class="list-item-title">{proj.name ?? 'Untitled'}</div>
              <div class="list-item-meta"><span>Due {formatDate(proj.bid_due_date)}</span></div>
            </div>
            <span class="badge badge-warning">{daysUntil(proj.bid_due_date)}d left</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="detail-section-title">Goals at Risk</div>
  {#if metrics.goalsAtRisk.length === 0}
    {#if loadedCount === projects.length}
      <div class="empty-state">
        <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <p class="empty-state-title">No goals at risk</p>
        <p class="empty-state-desc">All projects with parsed goals are meeting or exceeding their diversity targets.</p>
      </div>
    {:else}
      <p class="muted-note">Loading project goals…</p>
    {/if}
  {:else}
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Project</th><th>Goal</th><th>Actual</th><th>Gap</th></tr></thead>
        <tbody>
          {#each metrics.goalsAtRisk as risk}
            <tr on:click={() => navigate('/projects')} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
              <td class="primary">{risk.project.name ?? 'Untitled'}</td>
              <td class="secondary mono">{risk.goalPercent}%{#if risk.goalType} {risk.goalType}{/if}</td>
              <td class="secondary mono">{risk.actualPercent}%</td>
              <td class="secondary">{(risk.goalPercent - risk.actualPercent).toFixed(1)}% short</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each metrics.goalsAtRisk as risk}
          <div class="list-item" on:click={() => navigate('/projects')} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && navigate('/projects')}>
            <div class="list-item-main">
              <div class="list-item-title">{risk.project.name ?? 'Untitled'}</div>
              <div class="list-item-meta">
                <span>Goal: {risk.goalPercent}% {risk.goalType ?? ''}</span>
                <span>Actual: {risk.actualPercent}%</span>
              </div>
            </div>
            <span class="badge badge-warning">{(risk.goalPercent - risk.actualPercent).toFixed(1)}% short</span>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if loadedCount === projects.length && projects.length > 0 && metrics.goalsAtRisk.length === 0 && !metrics.hasAwardData}
    <p class="muted-note" style="margin-top:var(--tl-spacing-lg)">Tip: Goals at risk are computed from projects with a parseable participation goal (e.g., "18% DBE") and at least one awarded bid package. Projects without structured goals or awards won't appear here.</p>
  {/if}
{/if}

<style>
  .reports-progress {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    margin-bottom: var(--tl-spacing-md);
  }
  .reports-progress-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid var(--tl-color-neutral-200);
    border-top-color: var(--tl-color-brand, #2491eb);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .report-section {
    margin-bottom: var(--tl-spacing-xl);
  }
  .dist-row {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-sm);
    margin-bottom: var(--tl-spacing-xs);
  }
  .dist-label {
    flex: 0 0 120px;
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-600);
    text-align: right;
  }
  .dist-track {
    flex: 1;
    height: 24px;
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-md);
    overflow: hidden;
  }
  .dist-bar {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 var(--tl-spacing-sm);
    color: #fff;
    font-size: var(--tl-font-size-xs);
    font-weight: var(--tl-font-weight-semibold);
    border-radius: var(--tl-border-radius-md);
    min-width: 24px;
    transition: width 0.3s ease;
  }
  .dist-not_started { background: var(--tl-color-neutral-400); }
  .dist-filling_package { background: #f59e0b; }
  .dist-in_progress { background: #2491eb; }
  .dist-closed { background: #15803d; }
  .dist-count {
    flex: 0 0 32px;
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-600);
    font-weight: var(--tl-font-weight-semibold);
  }

  .deadline-range-toggle {
    display: flex;
    gap: var(--tl-spacing-xs);
    margin-bottom: var(--tl-spacing-md);
  }
  .deadline-range-btn {
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-lg);
    background: none;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    cursor: pointer;
  }
  .deadline-range-btn.active {
    border-color: var(--tl-color-brand, #2491eb);
    color: var(--tl-color-brand, #2491eb);
    font-weight: var(--tl-font-weight-semibold);
  }
</style>
