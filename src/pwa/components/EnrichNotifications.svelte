<script>
  import { onDestroy } from 'svelte';
  import { navigate } from '../lib/router.js';
  import { enrichmentStore, statusLabel } from '../lib/enrichment-store.js';

  let open = false;
  let enrichStates = {};

  const unsubEnrich = enrichmentStore.subscribe((states) => {
    enrichStates = states;
  });

  onDestroy(() => unsubEnrich());

  $: entries = Object.values(enrichStates).filter((s) =>
    s.status !== 'idle' && s.status !== 'dismissed'
  );
  $: activeCount = entries.filter((s) =>
    s.status === 'triggering' || s.status === 'polling' || s.status === 'queued'
  ).length;
  $: readyCount = entries.filter((s) => s.status === 'ready').length;
  $: badgeCount = activeCount + readyCount;

  function togglePanel() {
    open = !open;
  }

  function closePanel() {
    open = false;
  }

  function handleReview(companyId) {
    navigate(`/lookup?enrich=${companyId}`);
    closePanel();
  }

  function handleRetry(companyId) {
    enrichmentStore.retry(companyId);
  }

  function handleClear(companyId) {
    enrichmentStore.clear(companyId);
  }

  function viewAll() {
    navigate('/notifications');
    closePanel();
  }
</script>

<div class="notif-drawer">
  <button class="notif-bell" on:click={togglePanel} aria-label="Enrichment notifications" aria-expanded={open}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
    {#if badgeCount > 0}
      <span class="notif-badge" class:ready={readyCount > 0 && activeCount === 0}>{badgeCount}</span>
    {/if}
  </button>

  {#if open}
    <div class="notif-backdrop" on:click={closePanel} role="button" tabindex="-1" aria-label="Close notifications"></div>
    <div class="notif-panel" role="dialog" aria-label="Enrichment notifications">
      <div class="notif-panel-header">
        <span>Enrichments</span>
        <button class="notif-panel-close" on:click={closePanel} aria-label="Close">Done</button>
      </div>

      {#if entries.length === 0}
        <div class="notif-empty">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>
          <p>No enrichments running</p>
          <p class="notif-empty-hint">Trigger enrichment from Firm Lookup to enrich a firm's profile with AI.</p>
        </div>
      {:else}
        <div class="notif-list">
          {#each entries as entry (entry.companyId)}
            <div class="notif-item" class:ready={entry.status === 'ready'} class:failed={entry.status === 'failed'}>
              <div class="notif-item-main">
                <div class="notif-item-title">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="notif-item-meta">
                  {#if entry.status === 'triggering'}
                    <span>Starting...</span>
                  {:else if entry.status === 'queued'}
                    <span>Queued...</span>
                  {:else if entry.status === 'polling'}
                    <span class="notif-enrich-live">
                      <span class="notif-dot"></span>
                      {statusLabel(entry.serverStatus)}
                    </span>
                  {:else if entry.status === 'ready'}
                    <span class="notif-enrich-ready">Ready to review</span>
                  {:else if entry.status === 'failed'}
                    <span class="notif-enrich-error">{entry.error ?? 'Failed'}</span>
                  {:else if entry.status === 'applying'}
                    <span>Applying...</span>
                  {:else if entry.status === 'applied'}
                    <span class="notif-enrich-ready">Applied</span>
                  {/if}
                </div>
              </div>
              <div class="notif-item-actions">
                {#if entry.status === 'ready'}
                  <button class="notif-action notif-action-primary" on:click={() => handleReview(entry.companyId)}>Review</button>
                {:else if entry.status === 'failed'}
                  <button class="notif-action" on:click={() => handleRetry(entry.companyId)}>Retry</button>
                {:else if entry.status === 'applied'}
                  <button class="notif-action notif-action-muted" on:click={() => handleClear(entry.companyId)}>Clear</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
        <button class="notif-view-all" on:click={viewAll}>View all →</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .notif-drawer { position: relative; }
  .notif-bell {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    background: none;
    color: var(--tl-color-neutral-500);
    cursor: pointer;
    border-radius: var(--tl-border-radius-md);
    transition: all 150ms;
  }
  .notif-bell:hover { background: var(--tl-color-neutral-100); color: var(--tl-color-neutral-700); }
  .notif-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    background: var(--tl-color-brand, #2491eb);
    color: #fff;
    font-size: 10px;
    font-weight: var(--tl-font-weight-semibold);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  .notif-badge.ready { background: #15803d; }

  .notif-backdrop { position: fixed; inset: 0; z-index: 998; }
  .notif-panel {
    position: absolute;
    top: 42px;
    right: 0;
    width: 320px;
    max-height: 400px;
    overflow-y: auto;
    background: var(--tl-color-surface, #fff);
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-lg);
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.15);
    z-index: 999;
  }
  .notif-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-semibold);
    position: sticky;
    top: 0;
    background: var(--tl-color-surface, #fff);
    z-index: 1;
  }
  .notif-panel-close {
    background: none;
    border: none;
    color: var(--tl-color-brand, #2491eb);
    font-size: var(--tl-font-size-xs);
    cursor: pointer;
  }

  .notif-empty {
    padding: var(--tl-spacing-xl) var(--tl-spacing-md);
    text-align: center;
    color: var(--tl-color-neutral-400);
  }
  .notif-empty p {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
    margin: var(--tl-spacing-xs) 0 0;
  }
  .notif-empty-hint {
    font-size: var(--tl-font-size-xs) !important;
    color: var(--tl-color-neutral-400) !important;
  }

  .notif-list { display: flex; flex-direction: column; }
  .notif-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--tl-spacing-sm);
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
  }
  .notif-item:last-child { border-bottom: none; }
  .notif-item.ready { background: #f0fdf4; }
  .notif-item.failed { background: #fef2f2; }

  .notif-item-main { flex: 1; min-width: 0; }
  .notif-item-title {
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .notif-item-meta {
    display: flex;
    gap: var(--tl-spacing-xs);
    margin-top: 2px;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
  }

  .notif-enrich-live { display: inline-flex; align-items: center; gap: 4px; }
  .notif-enrich-ready { color: #15803d; font-weight: var(--tl-font-weight-medium); }
  .notif-enrich-error { color: #dc2626; }
  .notif-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tl-color-brand, #2491eb);
    animation: notif-pulse 1.5s ease-in-out infinite;
  }
  @keyframes notif-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

  .notif-item-actions { flex-shrink: 0; }
  .notif-action {
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-md);
    background: none;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-600);
    cursor: pointer;
    white-space: nowrap;
  }
  .notif-action:hover { border-color: var(--tl-color-brand, #2491eb); color: var(--tl-color-brand, #2491eb); }
  .notif-action-primary {
    background: var(--tl-color-brand, #2491eb);
    border-color: var(--tl-color-brand, #2491eb);
    color: #fff;
  }
  .notif-action-primary:hover { background: #1a7dd4; color: #fff; }
  .notif-action-muted { color: var(--tl-color-neutral-400); }

  .notif-view-all {
    display: block;
    width: 100%;
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    border: none;
    border-top: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    background: var(--tl-color-neutral-50);
    text-align: center;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-brand, #2491eb);
    cursor: pointer;
  }
  .notif-view-all:hover { text-decoration: underline; }

  @media (prefers-reduced-motion: reduce) {
    .notif-dot { animation: none; }
  }
</style>
