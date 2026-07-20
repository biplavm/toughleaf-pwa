<script>
  import Skeleton from './Skeleton.svelte';

  export let lines = 3;
  export let lineHeight = '1.125rem';
  export let gap = '0.375rem';
  export let lastLineWidth = '70%';
</script>

<div class="skeleton-text" style="--skeleton-gap: {gap}" aria-hidden="true">
  {#each Array(lines) as _, i}
    <Skeleton height={lineHeight} width={i === lines - 1 ? lastLineWidth : '100%'} />
  {/each}
</div>

<style>
  .skeleton-text {
    display: flex;
    flex-direction: column;
    gap: var(--skeleton-gap);
  }
</style>
