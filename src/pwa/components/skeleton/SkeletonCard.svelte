<script>
  import Skeleton from './Skeleton.svelte';
</script>

<div class="skeleton-card" aria-hidden="true">
  <Skeleton width="3rem" height="2.5rem" />
  <Skeleton width="5rem" height="0.875rem" />
</div>

<style>
  .skeleton-card {
    background: var(--tl-color-surface);
    border: 1px solid var(--tl-color-neutral-200);
    border-left: 3px solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-lg);
    padding: var(--tl-spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--tl-spacing-sm);
  }
</style>
