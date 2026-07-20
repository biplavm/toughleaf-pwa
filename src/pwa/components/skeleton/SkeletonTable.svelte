<script>
  import Skeleton from './Skeleton.svelte';

  export let rows = 8;
  export let columns = 4;
  export let showHeader = true;
</script>

<div class="skeleton-table" aria-hidden="true">
  <table>
    {#if showHeader}
      <thead>
        <tr>
          {#each Array(columns) as _, col}
            <td><Skeleton height="1.25rem" width="60%" /></td>
          {/each}
        </tr>
      </thead>
    {/if}
    <tbody>
      {#each Array(rows) as _, row}
        <tr style="animation-delay: {row * 80}ms">
          {#each Array(columns) as _, col}
            <td><Skeleton height="1rem" width={col === 0 ? '70%' : '85%'} /></td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .skeleton-table { width: 100%; overflow: hidden; }
  .skeleton-table table { width: 100%; border-collapse: collapse; }
  .skeleton-table td { padding: 0.75rem 1rem; border-bottom: 1px solid var(--tl-color-neutral-100); }
  .skeleton-table thead td { padding: 0.875rem 1rem; background-color: var(--tl-color-brand-surface); }
</style>
