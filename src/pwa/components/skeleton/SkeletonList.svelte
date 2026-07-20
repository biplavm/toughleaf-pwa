<script>
  import Skeleton from './Skeleton.svelte';
  import SkeletonText from './SkeletonText.svelte';

  export let items = 4;
  export let avatar = true;
  export let lines = 2;
</script>

<div class="skeleton-list" aria-hidden="true">
  {#each Array(items) as _, i}
    <div class="skeleton-item" style="animation-delay: {i * 100}ms">
      {#if avatar}
        <Skeleton width="2.5rem" height="2.5rem" circle />
      {/if}
      <div class="skeleton-item-content">
        <Skeleton width="40%" height="1rem" />
        <SkeletonText {lines} lineHeight="0.875rem" gap="0.25rem" />
      </div>
    </div>
  {/each}
</div>

<style>
  .skeleton-list { display: flex; flex-direction: column; gap: 1rem; }
  .skeleton-item { display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.75rem 1rem; border-bottom: 1px solid var(--tl-color-neutral-100); }
  .skeleton-item-content { flex: 1; display: flex; flex-direction: column; gap: 0.375rem; padding-top: 0.25rem; }
</style>
