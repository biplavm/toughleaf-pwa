<script>
  import { onDestroy } from 'svelte';
  import { navigate } from '../lib/router.js';
  import { enrichmentStore, statusLabel } from '../lib/enrichment-store.js';

  let open = false;
  let enrichStates = {};

  const unsub = enrichmentStore.subscribe((states) => {
    enrichStates = states;
  });

  onDestroy(() => unsub());

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

  function statusTone(status) {
    if (status === 'ready') return 'success';
    if (status === 'failed') return 'error';
    if (status === 'applied') return 'success';
    return 'info';
  }
</script>

<div class="enrich-notifications">
  <button class="enrich-bell" on:click={togglePanel} aria-label="Enrichment notifications" aria-expanded={open}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
    {#if badgeCount > 0}
      <span class="enrich-badge" class:ready={readyCount > 0 && activeCount === 0}>{badgeCount}</span>
    {/if}
  </button>

  {#if open}
    <div class="enrich-backdrop" on:click={closePanel} role="button" tabindex="-1" aria-label="Close notifications"></div>
    <div class="enrich-panel" role="dialog" aria-label="Enrichment status">
      <div class="enrich-panel-header">
        <span>Enrichments</span>
        {#if entries.length > 0}
          <button class="enrich-panel-close" on:click={closePanel} aria-label="Close">Done</button>
        {/if}
      </div>

      {#if entries.length === 0}
        <div class="enrich-panel-empty">
          <p>No enrichments running.</p>
          <p class="enrich-panel-empty-hint">Trigger enrichment from Firm Lookup to enrich a firm's profile with AI.</p>
        </div>
      {:else}
        <div class="enrich-panel-list">
          {#each entries as entry (entry.companyId)}
            <div class="enrich-panel-item" class:ready={entry.status === 'ready'} class:failed={entry.status === 'failed'}>
              <div class="enrich-panel-item-main">
                <div class="enrich-panel-item-name">{entry.companyName ?? `Company ${entry.companyId}`}</div>
                <div class="enrich-panel-item-status">
                  {#if entry.status === 'triggering'}
                    <span class="enrich-status enrich-status-info">Starting...</span>
                  {:else if entry.status === 'queued'}
                    <span class="enrich-status enrich-status-info">Queued...</span>
                  {:else if entry.status === 'polling'}
                    <span class="enrich-status enrich-status-info">
                      <span class="enrich-status-dot"></span>
                      {statusLabel(entry.serverStatus)}
                    </span>
                  {:else if entry.status === 'ready'}
                    <span class="enrich-status enrich-status-success">Ready to review</span>
                  {:else if entry.status === 'failed'}
                    <span class="enrich-status enrich-status-error">{entry.error ?? 'Failed'}</span>
                  {:else if entry.status === 'applying'}
                    <span class="enrich-status enrich-status-info">Applying...</span>
                  {:else if entry.status === 'applied'}
                    <span class="enrich-status enrich-status-success">Applied</span>
                  {/if}
                </div>
              </div>
              <div class="enrich-panel-item-actions">
                {#if entry.status === 'ready'}
                  <button class="enrich-action enrich-action-primary" on:click={() => handleReview(entry.companyId)}>Review</button>
                {:else if entry.status === 'failed'}
                  <button class="enrich-action" on:click={() => handleRetry(entry.companyId)}>Retry</button>
                {:else if entry.status === 'applied'}
                  <button class="enrich-action enrich-action-muted" on:click={() => handleClear(entry.companyId)}>Clear</button>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .enrich-notifications {
    position: relative;
  }
  .enrich-bell {
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
  .enrich-bell:hover {
    background: var(--tl-color-neutral-100);
    color: var(--tl-color-neutral-700);
  }
  .enrich-badge {
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
  .enrich-badge.ready {
    background: #15803d;
  }

  .enrich-backdrop {
    position: fixed;
    inset: 0;
    z-index: 998;
  }
  .enrich-panel {
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
  .enrich-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-semibold);
  }
  .enrich-panel-close {
    background: none;
    border: none;
    color: var(--tl-color-brand, #2491eb);
    font-size: var(--tl-font-size-xs);
    cursor: pointer;
  }
  .enrich-panel-empty {
    padding: var(--tl-spacing-xl) var(--tl-spacing-md);
    text-align: center;
  }
  .enrich-panel-empty p {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
    margin: 0;
  }
  .enrich-panel-empty-hint {
    font-size: var(--tl-font-size-xs) !important;
    margin-top: var(--tl-spacing-xs) !important;
    color: var(--tl-color-neutral-400) !important;
  }
  .enrich-panel-list {
    display: flex;
    flex-direction: column;
  }
  .enrich-panel-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--tl-spacing-sm);
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
  }
  .enrich-panel-item:last-child { border-bottom: none; }
  .enrich-panel-item.ready { background: #f0fdf4; }
  .enrich-panel-item.failed { background: #fef2f2; }
  .enrich-panel-item-main {
    flex: 1;
    min-width: 0;
  }
  .enrich-panel-item-name {
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-medium);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .enrich-panel-item-status {
    margin-top: 2px;
  }
  .enrich-status {
    font-size: var(--tl-font-size-xs);
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .enrich-status-info { color: var(--tl-color-neutral-500); }
  .enrich-status-success { color: #15803d; font-weight: var(--tl-font-weight-medium); }
  .enrich-status-error { color: #dc2626; }
  .enrich-status-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--tl-color-brand, #2491eb);
    animation: enrich-pulse 1.5s ease-in-out infinite;
  }
  @keyframes enrich-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  .enrich-panel-item-actions {
    flex-shrink: 0;
  }
  .enrich-action {
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-md);
    background: none;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-600);
    cursor: pointer;
    white-space: nowrap;
  }
  .enrich-action:hover {
    border-color: var(--tl-color-brand, #2491eb);
    color: var(--tl-color-brand, #2491eb);
  }
  .enrich-action-primary {
    background: var(--tl-color-brand, #2491eb);
    border-color: var(--tl-color-brand, #2491eb);
    color: #fff;
  }
  .enrich-action-primary:hover {
    background: #1a7dd4;
    color: #fff;
  }
  .enrich-action-muted {
    color: var(--tl-color-neutral-400);
  }
  @media (prefers-reduced-motion: reduce) {
    .enrich-status-dot { animation: none; }
  }
</style>
