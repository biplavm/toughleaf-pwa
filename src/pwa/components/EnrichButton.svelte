<script>
  import { onDestroy } from 'svelte';
  import { enrichmentStore, statusLabel } from '../lib/enrichment-store.js';
  import { online } from '../lib/stores.js';
  import EnrichProgressPill from './EnrichProgressPill.svelte';

  export let companyId;
  export let companyName = '';
  export let website = null;

  let state = null;
  let elapsedMs = 0;
  let intervalId = null;

  const unsub = enrichmentStore.subscribe((states) => {
    state = states[companyId] ?? null;
  });

  const unsubOnline = online.subscribe(() => {});

  $: if (state?.status === 'polling' && state?.pollStartedAt) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      elapsedMs = Date.now() - (state?.pollStartedAt ?? Date.now());
    }, 1000);
  } else {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    elapsedMs = 0;
  }

  onDestroy(() => {
    unsub();
    unsubOnline();
    if (intervalId) clearInterval(intervalId);
  });

  function handleTrigger() {
    enrichmentStore.trigger(companyId, companyName, website);
  }

  function handleRetry() {
    enrichmentStore.retry(companyId);
  }

  $: canTrigger = website && $online;
  $: isActive = state && (state.status === 'triggering' || state.status === 'polling' || state.status === 'applying');
</script>

{#if state?.status === 'triggering'}
  <span class="enrich-triggering">
    <span class="enrich-spinner"></span> Starting...
  </span>
{:else if state?.status === 'polling'}
  <EnrichProgressPill status={state.serverStatus} {elapsedMs} />
{:else if state?.status === 'queued'}
  <span class="enrich-queued">Queued...</span>
{:else if state?.status === 'ready'}
  <button class="enrich-btn enrich-btn-primary" on:click={() => enrichmentStore.getState(companyId)}
          aria-label="Review enrichment results">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    Review
  </button>
{:else if state?.status === 'failed'}
  <button class="enrich-btn enrich-btn-failed" on:click={handleRetry} aria-label="Retry enrichment">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
    Failed — Retry
  </button>
  {#if state.error}
    <div class="enrich-error" role="alert">{state.error}</div>
  {/if}
{:else if state?.status === 'applying'}
  <span class="enrich-triggering">
    <span class="enrich-spinner"></span> Applying...
  </span>
{:else if state?.status === 'applied'}
  <span class="enrich-done-tag">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
    Applied{#if state.appliedCount} ({state.appliedCount}){/if}
  </span>
{:else if state?.status === 'reviewed'}
  <span class="enrich-done-tag enrich-done-muted">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    Reviewed
  </span>
{:else}
  <button class="enrich-btn enrich-btn-outline" on:click={handleTrigger} disabled={!canTrigger}
          title={!website ? 'This firm has no website on file. Enrichment requires a website.' : !$online ? 'Connect to the internet to enrich firm profiles.' : ''}
          aria-label="Enrich firm profile">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>
    {website ? 'Enrich' : 'No website'}
  </button>
{/if}

<style>
  .enrich-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    border: var(--tl-border-width-thin) solid transparent;
    border-radius: var(--tl-border-radius-lg);
    font-size: var(--tl-font-size-xs);
    font-weight: var(--tl-font-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    min-height: 32px;
    transition: all 150ms;
  }
  .enrich-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .enrich-btn-outline {
    background: none;
    border-color: var(--tl-color-neutral-200);
    color: var(--tl-color-neutral-600);
  }
  .enrich-btn-outline:not(:disabled):hover {
    border-color: var(--tl-color-brand, #2491eb);
    color: var(--tl-color-brand, #2491eb);
  }
  .enrich-btn-primary {
    background: var(--tl-color-brand, #2491eb);
    color: #fff;
  }
  .enrich-btn-failed {
    background: none;
    border-color: #fca5a5;
    color: #dc2626;
  }
  .enrich-btn-failed:hover {
    background: #fef2f2;
  }
  .enrich-triggering {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
  }
  .enrich-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid var(--tl-color-neutral-200);
    border-top-color: var(--tl-color-brand, #2491eb);
    border-radius: 50%;
    animation: enrich-spin 0.8s linear infinite;
  }
  .enrich-queued {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-400);
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
  }
  .enrich-applied {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--tl-font-size-xs);
    color: #15803d;
    font-weight: var(--tl-font-weight-semibold);
  }
  .enrich-done-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--tl-font-size-xs);
    color: #15803d;
    font-weight: var(--tl-font-weight-medium);
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
  }
  .enrich-done-muted {
    color: var(--tl-color-neutral-400);
  }
  .enrich-error {
    font-size: 11px;
    color: #dc2626;
    margin-top: 2px;
    line-height: 1.3;
  }
  @keyframes enrich-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .enrich-spinner { animation: none; border-top-color: var(--tl-color-brand, #2491eb); }
  }
</style>
