<script>
  export let show = false;
  export let onInstall = null;
  export let onDismiss = null;
</script>

{#if show}
  <div class="toast">
    <span>Install Tough Leaf for quick access</span>
    <button on:click={() => onInstall?.()}>Install</button>
    <button class="dismiss" on:click={() => onDismiss?.()} aria-label="Dismiss">&times;</button>
  </div>
{/if}
