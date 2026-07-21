<script>
  import { createEventDispatcher } from 'svelte';
  import { fade, slide } from 'svelte/transition';
  import Modal from './Modal.svelte';
  import {
    enrichmentStore,
    defaultSelections,
    countSelected,
    buildApplyPayload,
  } from '../lib/enrichment-store.js';

  export let show = false;
  export let companyId = null;

  let selections = { suggestionKeys: new Set(), projects: new Set(), contacts: new Set(), addresses: new Set() };
  let selectionsInitialized = false;
  let applying = false;
  let error = '';

  const dispatch = createEventDispatcher();

  $: state = companyId != null ? enrichmentStore.getState(companyId) : null;
  $: result = state?.result ?? null;
  $: companyName = state?.companyName ?? 'Unknown';
  $: sourceUrl = result?.sourceUrl ?? null;

  $: if (show && result && !selectionsInitialized) {
    selections = defaultSelections(result);
    selectionsInitialized = true;
  }

  $: if (!show) {
    selectionsInitialized = false;
  }

  function toggleSuggestion(key) {
    const next = new Set(selections.suggestionKeys);
    if (next.has(key)) next.delete(key); else next.add(key);
    selections = { ...selections, suggestionKeys: next };
  }

  function toggleProject(idx) {
    const next = new Set(selections.projects);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    selections = { ...selections, projects: next };
  }

  function toggleContact(idx) {
    const next = new Set(selections.contacts);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    selections = { ...selections, contacts: next };
  }

  function toggleAddress(idx) {
    const next = new Set(selections.addresses);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    selections = { ...selections, addresses: next };
  }

  function selectAll() {
    if (!result) return;
    selections = {
      suggestionKeys: new Set((result.suggestions ?? []).map((_, i) => `suggestions:${i}`)),
      projects: new Set((result.keyProjects ?? []).map((_, i) => i)),
      contacts: new Set((result.contacts ?? []).map((_, i) => i)),
      addresses: new Set((result.addresses ?? []).map((_, i) => i)),
    };
  }

  function deselectAll() {
    selections = { suggestionKeys: new Set(), projects: new Set(), contacts: new Set(), addresses: new Set() };
  }

  $: selectedCount = countSelected(selections);

  function confidenceClass(s) {
    return s?.confidence === 'high' ? 'conf-high' : s?.confidence === 'medium' ? 'conf-medium' : 'conf-low';
  }

  function confidenceLabel(s) {
    return s?.confidence ? s.confidence.charAt(0).toUpperCase() + s.confidence.slice(1) : '';
  }

  function displayValue(v) {
    if (v == null) return '(none)';
    if (typeof v === 'object') {
      return [v.name, v.email, v.phone, v.street, v.city, v.state, v.zip]
        .filter(Boolean).join(', ');
    }
    return String(v);
  }

  async function handleApply() {
    if (selectedCount === 0 || applying) return;
    applying = true;
    error = '';
    try {
      await enrichmentStore.apply(companyId, selections);
      dispatch('applied', { companyId, appliedCount: selectedCount });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to apply suggestions';
    } finally {
      applying = false;
    }
  }

  async function handleDismiss() {
    try {
      await enrichmentStore.dismiss(companyId);
      dispatch('dismissed', { companyId });
    } catch {}
  }

  function handleClose() {
    dispatch('close');
  }

  $: totalSuggestions = (result?.suggestions?.length ?? 0) + (result?.keyProjects?.length ?? 0) + (result?.contacts?.length ?? 0) + (result?.addresses?.length ?? 0);
</script>

<Modal show={show} title="Profile Enrichment" on:close={handleClose} maxWidth={600}>
  <div class="enrich-review">
    {#if result}
      <div class="enrich-review-header">
        <div class="enrich-review-company">{companyName}</div>
        {#if sourceUrl}
          <a href={sourceUrl} target="_blank" rel="noopener noreferrer" class="enrich-review-source">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            {sourceUrl}
          </a>
        {/if}
        <div class="enrich-review-count">{totalSuggestions} suggestions found</div>
      </div>

      <div class="enrich-review-controls">
        <button class="enrich-review-btn" on:click={selectAll}>Select All</button>
        <button class="enrich-review-btn" on:click={deselectAll}>Deselect All</button>
      </div>

      {#if result.suggestions?.length}
        <div class="suggestion-group">
          <div class="suggestion-group-title">Company Details</div>
          {#each result.suggestions as s, i}
            {@const key = `suggestions:${i}`}
            <div class="suggestion-item" class:selected={selections.suggestionKeys.has(key)}
                 on:click={() => toggleSuggestion(key)} role="checkbox" aria-checked={selections.suggestionKeys.has(key)} tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && toggleSuggestion(key)}>
              <input type="checkbox" checked={selections.suggestionKeys.has(key)} on:click|stopPropagation={() => toggleSuggestion(key)} />
              <div class="suggestion-content">
                <div class="suggestion-field">
                  <span class="suggestion-label">{s.label ?? s.field}</span>
                  <span class="suggestion-confidence {confidenceClass(s)}">{confidenceLabel(s)}</span>
                </div>
                <div class="suggestion-values">
                  <span class="suggestion-current">{displayValue(s.currentValue)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  <span class="suggestion-new">{displayValue(s.suggestedValue)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if result.keyProjects?.length}
        <div class="suggestion-group">
          <div class="suggestion-group-title">Key Projects</div>
          {#each result.keyProjects as s, i}
            <div class="suggestion-item" class:selected={selections.projects.has(i)}
                 on:click={() => toggleProject(i)} role="checkbox" aria-checked={selections.projects.has(i)} tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && toggleProject(i)}>
              <input type="checkbox" checked={selections.projects.has(i)} on:click|stopPropagation={() => toggleProject(i)} />
              <div class="suggestion-content">
                <div class="suggestion-field">
                  <span class="suggestion-label">{s.label ?? s.field}</span>
                  <span class="suggestion-confidence {confidenceClass(s)}">{confidenceLabel(s)}</span>
                </div>
                <div class="suggestion-values">
                  <span class="suggestion-current">{displayValue(s.currentValue)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  <span class="suggestion-new">{displayValue(s.suggestedValue)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if result.contacts?.length}
        <div class="suggestion-group">
          <div class="suggestion-group-title">Contacts</div>
          {#each result.contacts as s, i}
            <div class="suggestion-item" class:selected={selections.contacts.has(i)}
                 on:click={() => toggleContact(i)} role="checkbox" aria-checked={selections.contacts.has(i)} tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && toggleContact(i)}>
              <input type="checkbox" checked={selections.contacts.has(i)} on:click|stopPropagation={() => toggleContact(i)} />
              <div class="suggestion-content">
                <div class="suggestion-field">
                  <span class="suggestion-label">{s.label ?? s.field}</span>
                  <span class="suggestion-confidence {confidenceClass(s)}">{confidenceLabel(s)}</span>
                </div>
                <div class="suggestion-values">
                  <span class="suggestion-current">{displayValue(s.currentValue)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  <span class="suggestion-new">{displayValue(s.suggestedValue)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if result.addresses?.length}
        <div class="suggestion-group">
          <div class="suggestion-group-title">Addresses</div>
          {#each result.addresses as s, i}
            <div class="suggestion-item" class:selected={selections.addresses.has(i)}
                 on:click={() => toggleAddress(i)} role="checkbox" aria-checked={selections.addresses.has(i)} tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && toggleAddress(i)}>
              <input type="checkbox" checked={selections.addresses.has(i)} on:click|stopPropagation={() => toggleAddress(i)} />
              <div class="suggestion-content">
                <div class="suggestion-field">
                  <span class="suggestion-label">{s.label ?? s.field}</span>
                  <span class="suggestion-confidence {confidenceClass(s)}">{confidenceLabel(s)}</span>
                </div>
                <div class="suggestion-values">
                  <span class="suggestion-current">{displayValue(s.currentValue)}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  <span class="suggestion-new">{displayValue(s.suggestedValue)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}

      {#if error}
        <div class="enrich-review-error" role="alert">{error}</div>
      {/if}
    {:else}
      <div class="enrich-review-empty">No enrichment results to display.</div>
    {/if}
  </div>

  <svelte:fragment slot="footer">
    <button class="btn btn-secondary btn-sm" on:click={handleDismiss} disabled={applying}>Dismiss</button>
    <button class="btn btn-primary btn-sm" on:click={handleApply} disabled={selectedCount === 0 || applying}>
      {applying ? 'Applying...' : `Apply ${selectedCount}`}
    </button>
  </svelte:fragment>
</Modal>

<style>
  .enrich-review {
    display: flex;
    flex-direction: column;
    gap: var(--tl-spacing-md);
  }
  .enrich-review-header {
    display: flex;
    flex-direction: column;
    gap: var(--tl-spacing-xs);
  }
  .enrich-review-company {
    font-size: var(--tl-font-size-base);
    font-weight: var(--tl-font-weight-semibold);
  }
  .enrich-review-source {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-brand, #2491eb);
    text-decoration: none;
    word-break: break-all;
  }
  .enrich-review-count {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
  }
  .enrich-review-controls {
    display: flex;
    gap: var(--tl-spacing-sm);
  }
  .enrich-review-btn {
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    background: none;
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-md);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-600);
    cursor: pointer;
  }
  .enrich-review-btn:hover {
    border-color: var(--tl-color-brand, #2491eb);
    color: var(--tl-color-brand, #2491eb);
  }
  .suggestion-group {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .suggestion-group-title {
    font-size: var(--tl-font-size-xs);
    text-transform: uppercase;
    font-weight: var(--tl-font-weight-semibold);
    color: var(--tl-color-neutral-500);
    padding: var(--tl-spacing-xs) 0;
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    margin-bottom: var(--tl-spacing-xs);
  }
  .suggestion-item {
    display: flex;
    gap: var(--tl-spacing-sm);
    padding: var(--tl-spacing-sm);
    border-radius: var(--tl-border-radius-md);
    cursor: pointer;
    transition: background 100ms;
  }
  .suggestion-item:hover {
    background: var(--tl-color-neutral-50);
  }
  .suggestion-item.selected {
    background: var(--tl-color-neutral-50);
  }
  .suggestion-item input[type="checkbox"] {
    margin-top: 2px;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    cursor: pointer;
    pointer-events: none;
  }
  .suggestion-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .suggestion-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--tl-spacing-xs);
  }
  .suggestion-label {
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-medium);
  }
  .suggestion-confidence {
    font-size: 10px;
    padding: 1px 6px;
    border-radius: var(--tl-border-radius-sm);
    text-transform: uppercase;
    font-weight: var(--tl-font-weight-semibold);
    white-space: nowrap;
  }
  .conf-high { background: #dcfce7; color: #15803d; }
  .conf-medium { background: #fef3c7; color: #b45309; }
  .conf-low { background: #fee2e2; color: #dc2626; }
  .suggestion-values {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    flex-wrap: wrap;
  }
  .suggestion-current {
    color: var(--tl-color-neutral-400);
    text-decoration: line-through;
  }
  .suggestion-new {
    color: var(--tl-color-neutral-700);
    font-weight: var(--tl-font-weight-medium);
  }
  .enrich-review-error {
    padding: var(--tl-spacing-sm);
    background: #fee2e2;
    border-radius: var(--tl-border-radius-md);
    color: #dc2626;
    font-size: var(--tl-font-size-sm);
  }
  .enrich-review-empty {
    padding: var(--tl-spacing-xl);
    text-align: center;
    color: var(--tl-color-neutral-500);
  }
</style>
