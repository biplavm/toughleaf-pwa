<script>
  import { onDestroy } from 'svelte';
  import { navigate } from '../lib/router.js';
  import { client } from '../lib/sdk.js';
  import { enrichmentStore, statusLabel } from '../lib/enrichment-store.js';
  import { actionRequiredSurveys, approachingDeadlines } from '../lib/reporting.js';

  const CACHE_KEY = 'tl_notifications_cache';

  let loading = false;
  let loaded = false;
  let actionItems = [];
  let deadlines = [];
  let enrichStates = {};

  const unsubEnrich = enrichmentStore.subscribe((states) => {
    enrichStates = states;
  });

  function loadCachedNotifications() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return;
      const cached = JSON.parse(raw);
      if (cached.actionItems) actionItems = cached.actionItems;
      if (cached.deadlines) deadlines = cached.deadlines;
      if (actionItems.length > 0 || deadlines.length > 0) loaded = true;
    } catch {}
  }

  function saveCachedNotifications() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        actionItems: actionItems.slice(0, 20),
        deadlines: deadlines.slice(0, 20),
        savedAt: Date.now(),
      }));
    } catch {}
  }

  async function loadNotifications() {
    if (loading) return;
    loading = true;
    try {
      const projects = await client.projects.list(undefined, { staleTime: 60_000 });
      deadlines = approachingDeadlines(projects, 14);

      const surveyPromises = projects.map((p) =>
        client.projects.listSurveys(p.id, undefined, { staleTime: 60_000 })
          .then((surveys) => surveys.map((s) => ({ ...s, project_name: p.name, project_id: p.id })))
          .catch(() => [])
      );
      const results = await Promise.all(surveyPromises);
      actionItems = actionRequiredSurveys(results.flat());
      saveCachedNotifications();
    } catch {}
    loaded = true;
    loading = false;
  }

  onDestroy(() => unsubEnrich());
  loadCachedNotifications();
  loadNotifications();

  $: enrichEntries = Object.values(enrichStates).filter((s) =>
    s.status !== 'idle'
  );
  $: enrichActive = enrichEntries.filter((s) =>
    s.status === 'triggering' || s.status === 'polling' || s.status === 'queued'
  );
  $: enrichReady = enrichEntries.filter((s) => s.status === 'ready');
  $: enrichFailed = enrichEntries.filter((s) => s.status === 'failed');
  $: enrichReviewed = enrichEntries.filter((s) => s.status === 'reviewed');
  $: enrichApplied = enrichEntries.filter((s) => s.status === 'applied' || s.status === 'applying');

  $: totalCount = actionItems.length + deadlines.length + enrichActive.length + enrichReady.length + enrichFailed.length + enrichReviewed.length + enrichApplied.length;

  function openProject(id) {
    navigate(`/projects?id=${id}`);
  }

  function openOutreach() {
    navigate('/outreach');
  }

  function openReports() {
    navigate('/reports');
  }

  function openLookup() {
    navigate('/lookup');
  }

  function handleReview(companyId) {
    navigate(`/lookup?enrich=${companyId}`);
  }

  function handleRetry(companyId) {
    enrichmentStore.retry(companyId);
  }

  function handleClear(companyId) {
    enrichmentStore.clear(companyId);
  }

  function clearCompletedEnrichments() {
    for (const entry of enrichEntries) {
      if (entry.status === 'applied' || entry.status === 'failed') {
        enrichmentStore.clear(entry.companyId);
      }
    }
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function elapsedLabel(startedAt) {
    if (!startedAt) return '';
    const secs = Math.round((Date.now() - startedAt) / 1000);
    if (secs < 60) return `${secs}s`;
    return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  }
</script>

<div class="notifications-page">
  <div class="notifications-header">
    <h2>Notifications</h2>
    {#if enrichApplied.length > 0 || enrichFailed.length > 0}
      <button class="btn btn-ghost btn-sm" on:click={clearCompletedEnrichments}>
        Clear completed
      </button>
    {/if}
  </div>

  {#if loading && totalCount === 0}
    <div class="detail-panel">
      <div class="notif-loading-row">
        <span class="notif-loading-spinner"></span> Loading notifications...
      </div>
    </div>
  {:else if totalCount === 0 && loaded}
    <div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <p class="empty-state-title">All caught up</p>
      <p class="empty-state-desc">No action items, deadlines, or enrichments need your attention.</p>
    </div>
  {:else}
    {#if actionItems.length > 0}
      <div class="detail-section-title">Action Required <span class="count">{actionItems.length}</span></div>
      <div class="detail-panel">
        <div class="notif-list-view">
          {#each actionItems.slice(0, 10) as item}
            <button class="notif-card" on:click={() => openProject(item.projectId)}>
              <div class="notif-card-main">
                <div class="notif-card-name">{item.companyName}</div>
                <div class="notif-card-meta">
                  <span>{item.projectName}</span>
                  <span>{item.workflowLabel}</span>
                  {#if item.overdue}<span class="notif-tag-overdue">Overdue</span>{/if}
                </div>
              </div>
              <svg class="notif-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          {/each}
        </div>
      </div>
      {#if actionItems.length > 10}
        <button class="notif-view-more" on:click={openOutreach}>View all {actionItems.length} in Outreach Hub →</button>
      {/if}
    {:else if loaded}
      <div class="detail-section-title">Action Required</div>
      <div class="detail-panel">
        <div class="notif-all-clear">No outreach items need attention right now.</div>
      </div>
    {/if}

    {#if deadlines.length > 0}
      <div class="detail-section-title">Approaching Deadlines <span class="count">{deadlines.length}</span></div>
      <div class="detail-panel">
        <div class="notif-list-view">
          {#each deadlines.slice(0, 10) as d}
            <button class="notif-card" on:click={() => openProject(d.project.id)}>
              <div class="notif-card-main">
                <div class="notif-card-name">{d.project.name ?? 'Untitled'}</div>
                <div class="notif-card-meta">
                  <span>Due {formatDate(d.dueDate)}</span>
                  <span class="notif-tag-urgent">{d.daysLeft}d left</span>
                </div>
              </div>
              <svg class="notif-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          {/each}
        </div>
      </div>
      {#if deadlines.length > 10}
        <button class="notif-view-more" on:click={openReports}>View all in Reports →</button>
      {/if}
    {/if}

    {#if enrichReady.length > 0}
      <div class="detail-section-title">Ready to Review <span class="count">{enrichReady.length}</span></div>
      <div class="detail-panel">
        <div class="notif-list-view">
          {#each enrichReady as entry (entry.companyId)}
            <div class="notif-card notif-card-ready">
              <div class="notif-card-main">
                <div class="notif-card-name">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="notif-card-meta">
                  <span class="notif-tag-ready">Enrichment ready</span>
                </div>
              </div>
              <div class="notif-card-actions">
                <button class="btn btn-primary btn-sm" on:click={() => handleReview(entry.companyId)}>Review</button>
                <button class="btn btn-ghost btn-sm" on:click={() => handleClear(entry.companyId)}>Dismiss</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if enrichActive.length > 0}
      <div class="detail-section-title">Enrichments in Progress <span class="count">{enrichActive.length}</span></div>
      <div class="detail-panel">
        <div class="notif-list-view">
          {#each enrichActive as entry (entry.companyId)}
            <div class="notif-card">
              <div class="notif-card-main">
                <div class="notif-card-name">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="notif-card-meta">
                  {#if entry.status === 'triggering'}
                    <span class="notif-tag-info">Starting...</span>
                  {:else if entry.status === 'queued'}
                    <span class="notif-tag-info">Queued...</span>
                  {:else if entry.status === 'polling'}
                    <span class="notif-tag-live">
                      <span class="notif-dot"></span>
                      {statusLabel(entry.serverStatus)}
                      {#if entry.pollStartedAt}
                        <span class="notif-elapsed">· {elapsedLabel(entry.pollStartedAt)}</span>
                      {/if}
                    </span>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if enrichFailed.length > 0}
      <div class="detail-section-title">Failed Enrichments <span class="count">{enrichFailed.length}</span></div>
      <div class="detail-panel">
        <div class="notif-list-view">
          {#each enrichFailed as entry (entry.companyId)}
            <div class="notif-card notif-card-failed">
              <div class="notif-card-main">
                <div class="notif-card-name">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="notif-card-meta">
                  <span class="notif-tag-error">{entry.error ?? 'Enrichment failed'}</span>
                </div>
              </div>
              <div class="notif-card-actions">
                <button class="btn btn-ghost btn-sm" on:click={() => handleRetry(entry.companyId)}>Retry</button>
                <button class="btn btn-ghost btn-sm" on:click={() => handleClear(entry.companyId)}>Dismiss</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if enrichApplied.length > 0 || enrichReviewed.length > 0}
      <div class="detail-section-title">Completed <span class="count">{enrichApplied.length + enrichReviewed.length}</span></div>
      <div class="detail-panel">
        <div class="notif-list-view">
          {#each enrichApplied as entry (entry.companyId)}
            <div class="notif-card notif-card-applied">
              <div class="notif-card-main">
                <div class="notif-card-name">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="notif-card-meta">
                  {#if entry.status === 'applying'}
                    <span class="notif-tag-info">Applying suggestions...</span>
                  {:else if entry.appliedCount}
                    <span class="notif-tag-ready">✓ Applied {entry.appliedCount} suggestion{entry.appliedCount > 1 ? 's' : ''}</span>
                  {:else}
                    <span class="notif-tag-ready">✓ Applied</span>
                  {/if}
                </div>
              </div>
              {#if entry.status === 'applied'}
                <div class="notif-card-actions">
                  <button class="btn btn-ghost btn-sm" on:click={() => handleClear(entry.companyId)}>Clear</button>
                </div>
              {/if}
            </div>
          {/each}
          {#each enrichReviewed as entry (entry.companyId)}
            <div class="notif-card notif-card-reviewed">
              <div class="notif-card-main">
                <div class="notif-card-name">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="notif-card-meta">
                  <span class="notif-tag-reviewed">✓ Reviewed {#if entry.reviewedAction === 'dismissed'}— dismissed{/if}</span>
                </div>
              </div>
              <div class="notif-card-actions">
                <button class="btn btn-ghost btn-sm" on:click={() => handleClear(entry.companyId)}>Clear</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    {#if !loaded && actionItems.length === 0 && deadlines.length > 0}
      <div class="detail-section-title">Action Required</div>
      <div class="detail-panel">
        <div class="notif-loading-row">
          <span class="notif-loading-spinner"></span> Checking outreach...
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .notifications-page {
    max-width: 640px;
  }
  .notifications-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--tl-spacing-lg);
  }
  .notifications-header h2 {
    font-size: var(--tl-font-size-lg);
    font-weight: var(--tl-font-weight-semibold);
    margin: 0;
  }

  .notif-loading-row {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    padding: var(--tl-spacing-md);
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
  }
  .notif-loading-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid var(--tl-color-neutral-200);
    border-top-color: var(--tl-color-brand, #2491eb);
    border-radius: 50%;
    animation: notif-spin 0.8s linear infinite;
  }
  @keyframes notif-spin { to { transform: rotate(360deg); } }

  .notif-all-clear {
    padding: var(--tl-spacing-md);
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
  }

  .notif-list-view {
    display: flex;
    flex-direction: column;
  }
  .notif-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--tl-spacing-md);
    width: 100%;
    padding: var(--tl-spacing-md);
    border: none;
    background: none;
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    cursor: pointer;
    text-align: left;
    transition: background 100ms;
  }
  .notif-card:last-child { border-bottom: none; }
  .notif-card:hover { background: var(--tl-color-neutral-50); }
  .notif-card-ready { background: #f0fdf4; }
  .notif-card-ready:hover { background: #dcfce7; }
  .notif-card-failed { background: #fef2f2; }
  .notif-card-failed:hover { background: #fee2e2; }
  .notif-card-applied { opacity: 0.75; }
  .notif-card-reviewed { opacity: 0.6; }

  .notif-card-main { flex: 1; min-width: 0; }
  .notif-card-name {
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-semibold);
    margin-bottom: 2px;
  }
  .notif-card-meta {
    display: flex;
    gap: var(--tl-spacing-xs);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    flex-wrap: wrap;
  }
  .notif-card-arrow { color: var(--tl-color-neutral-300); flex-shrink: 0; }

  .notif-card-actions {
    display: flex;
    gap: var(--tl-spacing-xs);
    flex-shrink: 0;
  }

  .notif-tag-overdue { color: #dc2626; font-weight: var(--tl-font-weight-medium); }
  .notif-tag-urgent { color: #b45309; font-weight: var(--tl-font-weight-medium); }
  .notif-tag-ready { color: #15803d; font-weight: var(--tl-font-weight-medium); }
  .notif-tag-reviewed { color: var(--tl-color-neutral-500); font-weight: var(--tl-font-weight-medium); }
  .notif-tag-info { color: var(--tl-color-neutral-500); }
  .notif-tag-error { color: #dc2626; }
  .notif-tag-live {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .notif-elapsed { color: var(--tl-color-neutral-400); }

  .notif-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tl-color-brand, #2491eb);
    animation: notif-pulse 1.5s ease-in-out infinite;
  }
  @keyframes notif-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .notif-view-more {
    display: block;
    background: none;
    border: none;
    padding: var(--tl-spacing-sm) 0;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-brand, #2491eb);
    cursor: pointer;
    text-align: left;
  }
  .notif-view-more:hover { text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) {
    .notif-dot, .notif-loading-spinner { animation: none; }
  }
</style>
