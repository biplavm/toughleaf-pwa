<script>
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  export let show = false;
  export let title = '';
  export let dismissible = true;
  export let maxWidth = null;

  const dispatch = createEventDispatcher();
  let modalEl;
  let previouslyFocused;

  function close() {
    if (!dismissible) return;
    dispatch('close');
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && dismissible) {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();
      trapFocus(e.shiftKey ? -1 : 1);
    }
  }

  function trapFocus(dir) {
    if (!modalEl) return;
    const tabbable = [...modalEl.querySelectorAll(
      'input:not([type="hidden"]),select,textarea,button,[tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.hidden && !el.disabled);
    if (!tabbable.length) return;
    const activeEl = document.activeElement;
    let idx = tabbable.indexOf(activeEl) + dir;
    if (idx < 0) idx = tabbable.length - 1;
    if (idx >= tabbable.length) idx = 0;
    tabbable[idx].focus();
  }

  $: if (show) {
    previouslyFocused = document.activeElement;
    Promise.resolve().then(() => modalEl?.querySelector('button, input, [tabindex]')?.focus());
  } else {
    previouslyFocused?.focus?.();
  }

  onDestroy(() => {
    previouslyFocused?.focus?.();
  });
</script>

<svelte:window on:keydown={show ? handleKeydown : undefined} />

{#if show}
  <div
    class="modal-backdrop"
    transition:fade={{ duration: 200 }}
    on:mousedown|self={close}
    on:touchstart|self={close}
    role="button"
    tabindex="-1"
  >
    <div
      class="modal-container"
      class:custom-width={maxWidth}
      style:--modal-max-width={maxWidth ? `${maxWidth}px` : null}
      bind:this={modalEl}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      transition:scale={{ start: 0.96, duration: 150 }}
    >
      <div class="modal-header">
        <h2>{title}</h2>
        {#if dismissible}
          <button class="modal-close" on:click={close} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        {/if}
      </div>
      <div class="modal-body">
        <slot />
      </div>
      {#if $$slots.footer}
        <div class="modal-footer">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    align-items: stretch;
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    padding: 0;
    overflow-y: auto;
  }

  .modal-container {
    width: 100%;
    max-width: 480px;
    height: 100%;
    background: var(--tl-color-surface, #fff);
    border-radius: var(--tl-border-radius-lg, 12px);
    border: 1px solid var(--tl-color-neutral-200, #e5e7eb);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-height: 100vh;
    border-radius: 0;
    overflow-y: auto;
    position: relative;
  }

  .modal-container.custom-width {
    max-width: var(--modal-max-width);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--tl-spacing-lg, 24px);
    border-bottom: 1px solid var(--tl-color-neutral-200, #e5e7eb);
    background: var(--tl-color-brand-surface, #eff8ff);
    border-radius: var(--tl-border-radius-lg, 12px) var(--tl-border-radius-lg, 12px) 0 0;
  }

  .modal-header h2 {
    font-size: var(--tl-font-size-lg, 1.92rem);
    font-weight: var(--tl-font-weight-semibold, 600);
    letter-spacing: -0.01em;
    color: var(--tl-color-brand-hover, #1a6fc4);
    margin: 0;
  }

  .modal-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    color: var(--tl-color-neutral-500, #71717a);
    border-radius: var(--tl-border-radius-md, 8px);
    cursor: pointer;
    transition: all 150ms;
    flex-shrink: 0;
  }

  .modal-close:hover {
    background: var(--tl-color-control-surface, #f4f4f5);
    color: var(--tl-color-text-on-background, #18181b);
  }

  .modal-body {
    padding: var(--tl-spacing-lg, 24px);
  }

  .modal-footer {
    padding: var(--tl-spacing-md, 16px) var(--tl-spacing-lg, 24px) var(--tl-spacing-lg, 24px);
    border-top: 1px solid var(--tl-color-neutral-100, #f4f4f5);
    display: flex;
    gap: var(--tl-spacing-sm, 12px);
    justify-content: flex-end;
  }

  @media (max-width: 768px) {
    .modal-backdrop {
    align-items: stretch;
      padding: 0;
      align-items: flex-end;
    }

    .modal-container {
      max-width: 100%;
      max-height: 100vh;
      border-radius: 0;
      border-radius: var(--tl-border-radius-lg, 12px) var(--tl-border-radius-lg, 12px) 0 0;
      animation: slide-up 250ms cubic-bezier(0.32, 0.72, 0, 1);
    }

    @keyframes slide-up {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
  }
</style>
