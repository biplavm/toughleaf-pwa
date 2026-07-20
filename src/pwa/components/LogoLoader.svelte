<script>
  import { onMount } from 'svelte';

  export let animationSpeed = 1;
  export let width = 80;
  export let mobileWidth = 32;
  export let height = 80;

  let player;
  let LottiePlayer;

  onMount(async () => {
    const module = await import('@lottiefiles/svelte-lottie-player');
    LottiePlayer = module.LottiePlayer;
  });

  $: if (player && typeof player.play === 'function') {
    setTimeout(() => player?.play());
  }
</script>

{#if LottiePlayer}
  <svelte:component
    this={LottiePlayer}
    bind:this={player}
    src="/animations/tl_logo.json"
    loop
    renderer="svg"
    background="transparent"
    speed={animationSpeed}
    {height}
    {width}
  />
{:else}
  <div class="logo-placeholder" style="width: {width}px; height: {height}px;" />
{/if}

<style>
  .logo-placeholder {
    background-color: transparent;
  }
</style>
