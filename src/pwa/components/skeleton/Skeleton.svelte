<script>
  export let width = '100%';
  export let height = '1rem';
  export let rounded = 'sm';
  export let circle = false;
  export let shimmer = true;
</script>

<div
  class="skeleton"
  class:circle
  class:shimmer
  style="--skeleton-w: {width}; --skeleton-h: {height}; --skeleton-r: var(--tl-border-radius-{rounded}, 6px)"
  aria-hidden="true"
/>

<style>
  .skeleton {
    width: var(--skeleton-w);
    height: var(--skeleton-h);
    border-radius: var(--skeleton-r);
    background-color: color-mix(in srgb, var(--tl-color-neutral-200) 55%, var(--tl-color-neutral-300));
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .skeleton.circle { border-radius: 50%; }

  .skeleton.shimmer::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: shimmer 1.8s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @media (prefers-reduced-motion: reduce) {
    .skeleton.shimmer::after { animation: none; }
  }
</style>
