<script>
  export let status = '';
  export let elapsedMs = 0;
</script>

<div class="enrich-pill" role="status" aria-live="polite">
  <span class="enrich-pill-spinner"></span>
  <span class="enrich-pill-text">
    {#if status === 'queued'}Queued...{:else if status === 'scraping'}Reading website...{:else if status === 'scraped'}Website read...{:else if status === 'processing'}Analyzing profile...{:else if status === 'pending_decision'}Finalizing...{:else}Working...{/if}
  </span>
  {#if elapsedMs >= 10000}
    <span class="enrich-pill-time">{Math.round(elapsedMs / 1000)}s</span>
  {/if}
</div>

<style>
  .enrich-pill {
    display: inline-flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-lg);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-600);
    white-space: nowrap;
  }
  .enrich-pill-spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid var(--tl-color-neutral-200);
    border-top-color: var(--tl-color-brand, #2491eb);
    border-radius: 50%;
    animation: enrich-spin 0.8s linear infinite;
    flex-shrink: 0;
  }
  .enrich-pill-text { min-width: 0; }
  .enrich-pill-time { color: var(--tl-color-neutral-400); }
  @keyframes enrich-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .enrich-pill-spinner { animation: none; border-top-color: var(--tl-color-brand, #2491eb); }
  }
</style>
