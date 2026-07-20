<script>
  import Skeleton from './Skeleton.svelte';

  export let rows = 6;
  export let sections = 1;
</script>

<div class="skeleton-detail" aria-hidden="true">
  {#each Array(sections) as _, section}
    <div class="skeleton-section" style="animation-delay: {section * 200}ms">
      {#if sections > 1}
        <Skeleton width="30%" height="1.25rem" rounded="md" />
      {/if}
      {#each Array(rows) as _, row}
        <div class="skeleton-row" style="animation-delay: {(section * rows + row) * 80}ms">
          <Skeleton width="25%" height="0.875rem" />
          <Skeleton width="55%" height="1rem" />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .skeleton-detail { display: flex; flex-direction: column; gap: 1.5rem; }
  .skeleton-section { display: flex; flex-direction: column; gap: 1rem; }
  .skeleton-row { display: flex; gap: 1rem; align-items: center; }
</style>
