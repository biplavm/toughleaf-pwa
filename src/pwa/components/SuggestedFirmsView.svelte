<script>
  import { createEventDispatcher } from 'svelte';
  import { client } from '../lib/sdk.js';
  import { suggestedFirmsSearchFilter, isFirmInPackage, firmOtherPackages } from '../lib/sourcing.js';
  import SkeletonList from './skeleton/SkeletonList.svelte';

  export let project = null;
  export let bidPackage = null;
  export let participants = [];

  const dispatch = createEventDispatcher();

  let loading = true;
  let error = '';
  let results = [];
  let activeSearch = null;
  let removedFirms = [];
  let showRemoved = false;
  let selectedFirms = new Set();
  let actionLoading = {};

  let showFilters = false;
  let filterState = '';
  let states = [];
  let selectedCerts = [];
  let certifications = [];
  let selectedBusinessSizes = [];
  let businessSizes = [];
  let selectedEthnicities = [];

  async function loadSuggested() {
    loading = true;
    error = '';
    results = [];
    activeSearch = null;
    try {
      const filter = suggestedFirmsSearchFilter(project, bidPackage);
      if (filterState) filter.states = [filterState];
      if (selectedCerts.length) filter.certification_ids = selectedCerts;
      if (selectedBusinessSizes.length) filter.business_sizes = selectedBusinessSizes;
      if (selectedEthnicities.length) filter.ethnicities = selectedEthnicities;

      const data = await client.companies.search(filter, { fresh: true });
      results = (data.results ?? []).filter(
        (c) => !isFirmInPackage(c.id, participants, bidPackage?.id),
      );
      activeSearch = data;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load suggested firms';
    } finally {
      loading = false;
    }
  }

  async function loadLookupData() {
    try {
      const [s, certs, bs] = await Promise.all([
        client.lookup.listStates().catch(() => []),
        client.lookup.listCertifications().catch(() => []),
        client.lookup.listBusinessSizes().catch(() => []),
      ]);
      states = s;
      certifications = certs;
      businessSizes = bs;
    } catch {}
  }

  async function refreshResults() {
    if (!activeSearch?.id) return;
    try {
      const data = await client.companies.getSearchResults(activeSearch.id, { staleTime: 0 });
      results = (data.results ?? []).filter(
        (c) => !isFirmInPackage(c.id, participants, bidPackage?.id) &&
          !removedFirms.some((r) => r.id === c.id),
      );
      activeSearch = data;
    } catch {}
  }

  async function addToPackage(companyId) {
    actionLoading[companyId] = true;
    try {
      await client.projects.addParticipants(project.id, [{
        company_id: companyId,
        bid_package_ids: [bidPackage.id],
      }]);
      results = results.filter((c) => c.id !== companyId);
      selectedFirms.delete(companyId);
      selectedFirms = selectedFirms;
      participants = [...participants, { company_id: companyId, bid_packages: [{ bid_package_id: bidPackage.id }] }];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to add firm';
    } finally {
      actionLoading[companyId] = false;
    }
  }

  async function bulkAdd() {
    const ids = [...selectedFirms];
    if (ids.length === 0) return;
    for (const id of ids) {
      await addToPackage(id);
    }
    selectedFirms = new Set();
  }

  async function removeFirm(companyId) {
    if (!activeSearch?.id) return;
    actionLoading[companyId] = true;
    try {
      await client.companies.saveFeedback(activeSearch.id, companyId, {
        score: -1,
        failure_criteria: { user_flagged: true },
      });
      const firm = results.find((c) => c.id === companyId);
      if (firm) removedFirms.push(firm);
      results = results.filter((c) => c.id !== companyId);
      selectedFirms.delete(companyId);
      selectedFirms = selectedFirms;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to remove firm';
    } finally {
      actionLoading[companyId] = false;
    }
  }

  async function restoreFirm(companyId) {
    if (!activeSearch?.id) return;
    actionLoading[companyId] = true;
    try {
      await client.companies.clearFeedback(activeSearch.id, companyId);
      const firm = removedFirms.find((c) => c.id === companyId);
      if (firm) {
        removedFirms = removedFirms.filter((c) => c.id !== companyId);
        if (!isFirmInPackage(companyId, participants, bidPackage?.id)) {
          results = [...results, firm];
        }
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to restore firm';
    } finally {
      actionLoading[companyId] = false;
    }
  }

  function toggleSelect(companyId) {
    const next = new Set(selectedFirms);
    if (next.has(companyId)) next.delete(companyId); else next.add(companyId);
    selectedFirms = next;
  }

  function selectAll() {
    selectedFirms = new Set(results.map((c) => c.id));
  }

  function deselectAll() {
    selectedFirms = new Set();
  }

  function toggleMulti(arr, value) {
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(value);
    arr = arr;
  }

  function applyFilters() {
    showFilters = false;
    loadSuggested();
  }

  function clearFilters() {
    filterState = '';
    selectedCerts = [];
    selectedBusinessSizes = [];
    selectedEthnicities = [];
  }

  function formatDistance(miles) {
    if (miles == null) return '';
    return `${Math.round(miles)} mi`;
  }

  function requiredCapHighlight(cap, reqCaps) {
    const reqSet = new Set((reqCaps ?? []).map((c) => typeof c === 'string' ? c.toLowerCase() : (c?.name ?? '').toLowerCase()));
    const name = typeof cap === 'string' ? cap : cap?.name ?? '';
    return reqSet.has(name.toLowerCase());
  }

  $: selectedCount = selectedFirms.size;
  $: reqCaps = bidPackage?.req_capabilities ?? bidPackage?.required_capabilities ?? [];

  loadLookupData();
  loadSuggested();
</script>

<div class="suggested-firms">
  <div class="suggested-header">
    <div class="suggested-header-main">
      <h3>Suggested Firms</h3>
      <span class="suggested-count">{results.length} firms{#if removedFirms.length > 0} · {removedFirms.length} removed{/if}</span>
    </div>
  </div>

  <div class="suggested-toolbar">
    <button class="btn btn-secondary btn-sm" on:click={() => (showFilters = !showFilters)}>
      {showFilters ? 'Close' : 'Filters'}
    </button>
    <button class="btn btn-ghost btn-sm" on:click={refreshResults} disabled={loading}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
      Refresh
    </button>
    {#if removedFirms.length > 0}
      <button class="btn btn-ghost btn-sm" on:click={() => (showRemoved = !showRemoved)}>
        {showRemoved ? 'Hide Removed' : `Removed (${removedFirms.length})`}
      </button>
    {/if}
  </div>

  {#if showFilters}
    <div class="suggested-filters">
      <select class="filter-select" bind:value={filterState}>
        <option value="">All states</option>
        {#each states as s}<option value={s.abbr}>{s.name} ({s.abbr})</option>{/each}
      </select>

      {#if certifications.length}
        <div class="filter-chips-row">
          {#each certifications.slice(0, 10) as cert}
            <button class="filter-chip" class:selected={selectedCerts.includes(cert.id)}
              on:click={() => toggleMulti(selectedCerts, cert.id)}>
              {cert.name ?? cert.agency ?? `Cert ${cert.id}`}
            </button>
          {/each}
        </div>
      {/if}

      {#if businessSizes.length}
        <div class="filter-chips-row">
          {#each businessSizes as bs}
            <button class="filter-chip" class:selected={selectedBusinessSizes.includes(bs.code)}
              on:click={() => toggleMulti(selectedBusinessSizes, bs.code)}>
              {bs.text}
            </button>
          {/each}
        </div>
      {/if}

      <div class="filter-chips-row">
        {#each ['Asian', 'Black', 'Hispanic', 'Native American', 'White', 'Other'] as eth}
          <button class="filter-chip" class:selected={selectedEthnicities.includes(eth)}
            on:click={() => toggleMulti(selectedEthnicities, eth)}>
            {eth}
          </button>
        {/each}
      </div>

      <div style="display:flex;gap:var(--tl-spacing-sm);margin-top:var(--tl-spacing-sm)">
        <button class="btn btn-ghost btn-sm" on:click={clearFilters}>Clear all</button>
        <button class="btn btn-primary btn-sm" on:click={applyFilters}>Apply & Search</button>
      </div>
    </div>
  {/if}

  {#if error}<div class="form-error">{error}</div>{/if}

  {#if showRemoved}
    <div class="detail-section-title">Removed Firms</div>
    {#if removedFirms.length === 0}
      <div class="empty-state" style="padding:var(--tl-spacing-lg)">
        <p class="empty-state-title">No removed firms</p>
      </div>
    {:else}
      <div class="suggested-list">
        {#each removedFirms as firm}
          <div class="firm-card firm-card-removed">
            <div class="firm-card-main">
              <div class="firm-card-name">{firm.company_name ?? 'Unknown'}</div>
              <div class="firm-card-meta">Removed by you</div>
            </div>
            <button class="btn btn-ghost btn-sm" on:click={() => restoreFirm(firm.id)} disabled={actionLoading[firm.id]}>
              {actionLoading[firm.id] ? '…' : 'Restore'}
            </button>
          </div>
        {/each}
      </div>
    {/if}
  {/if}

  {#if loading}
    <SkeletonList items={5} lines={3} />
  {:else if results.length === 0 && !showRemoved}
    <div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>
      <p class="empty-state-title">No suggested firms found</p>
      <p class="empty-state-desc">Try adjusting filters or refreshing. These are quick suggestions — full AI-optimized results are available on desktop.</p>
    </div>
  {:else}
    {#if results.length > 0}
      <div class="suggested-bulk-bar">
        <button class="btn btn-ghost btn-sm" on:click={selectedCount === results.length ? deselectAll : selectAll}>
          {selectedCount === results.length ? 'Deselect all' : 'Select all'}
        </button>
        {#if selectedCount > 0}
          <button class="btn btn-primary btn-sm" on:click={bulkAdd}>
            Add {selectedCount} to package
          </button>
        {/if}
      </div>
    {/if}

    <div class="suggested-list">
      {#each results as firm}
        {@const isSelected = selectedFirms.has(firm.id)}
        {@const otherPkgs = firmOtherPackages(firm.id, participants, bidPackage?.id)}
        <div class="firm-card" class:selected={isSelected}>
          <div class="firm-card-checkbox">
            <input type="checkbox" checked={isSelected} on:change={() => toggleSelect(firm.id)} />
          </div>
          <div class="firm-card-main">
            <div class="firm-card-name">{firm.company_name ?? 'Unknown'}</div>
            {#if firm.dba}<div class="firm-card-dba">DBA: {firm.dba}</div>{/if}
            <div class="firm-card-meta">
              {#if firm.city || firm.state}<span>{[firm.city, firm.state].filter(Boolean).join(', ')}</span>{/if}
              {#if firm.distance != null}<span>{formatDistance(firm.distance)}</span>{/if}
              {#if otherPkgs.length > 0}<span class="firm-card-other-pkg">In {otherPkgs.length} other package{otherPkgs.length > 1 ? 's' : ''}</span>{/if}
            </div>
            {#if firm.capabilities?.length}
              <div class="firm-card-caps">
                {#each firm.capabilities.slice(0, 5) as cap}
                  <span class="tag-pill" class:tag-required={requiredCapHighlight(cap, reqCaps)}>
                    {cap.name ?? cap}
                  </span>
                {/each}
              </div>
            {/if}
            {#if firm.certifications?.length}
              <div class="firm-card-certs">
                {#each firm.certifications.slice(0, 3) as cert}
                  <span class="tag-pill tag-pill-success">{cert.name ?? cert.agency ?? cert}</span>
                {/each}
              </div>
            {/if}
          </div>
          <div class="firm-card-actions">
            <button class="btn btn-primary btn-sm" on:click={() => addToPackage(firm.id)} disabled={actionLoading[firm.id]}>
              {actionLoading[firm.id] ? '…' : 'Add'}
            </button>
            <button class="btn btn-ghost btn-sm" on:click={() => removeFirm(firm.id)} disabled={actionLoading[firm.id]}>
              Remove
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .suggested-firms {
    margin-top: var(--tl-spacing-md);
  }
  .suggested-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--tl-spacing-md);
  }
  .suggested-header-main {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .suggested-header h3 {
    font-size: var(--tl-font-size-base);
    font-weight: var(--tl-font-weight-semibold);
    margin: 0;
  }
  .suggested-count {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
  }

  .suggested-toolbar {
    display: flex;
    gap: var(--tl-spacing-xs);
    margin-bottom: var(--tl-spacing-md);
  }

  .suggested-filters {
    padding: var(--tl-spacing-md);
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-lg);
    margin-bottom: var(--tl-spacing-md);
  }
  .filter-chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--tl-spacing-xs);
    margin-top: var(--tl-spacing-sm);
  }

  .suggested-bulk-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--tl-spacing-xs) 0;
    margin-bottom: var(--tl-spacing-sm);
    position: sticky;
    top: 0;
    background: var(--tl-color-surface, #fff);
    z-index: 1;
  }

  .suggested-list {
    display: flex;
    flex-direction: column;
    gap: var(--tl-spacing-sm);
  }
  .firm-card {
    display: flex;
    gap: var(--tl-spacing-sm);
    padding: var(--tl-spacing-md);
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
    border-radius: var(--tl-border-radius-lg);
    transition: all 100ms;
  }
  .firm-card.selected {
    border-color: var(--tl-color-brand, #2491eb);
    background: var(--tl-color-brand-surface, #eff8ff);
  }
  .firm-card-removed {
    opacity: 0.6;
  }
  .firm-card-checkbox {
    flex-shrink: 0;
    padding-top: 2px;
  }
  .firm-card-checkbox input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  .firm-card-main {
    flex: 1;
    min-width: 0;
  }
  .firm-card-name {
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-semibold);
  }
  .firm-card-dba {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
  }
  .firm-card-meta {
    display: flex;
    gap: var(--tl-spacing-xs);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    flex-wrap: wrap;
    margin-top: 2px;
  }
  .firm-card-other-pkg {
    color: var(--tl-color-brand, #2491eb);
    font-weight: var(--tl-font-weight-medium);
  }
  .firm-card-caps, .firm-card-certs {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: var(--tl-spacing-xs);
  }
  .tag-required {
    background: var(--tl-color-brand-surface, #eff8ff);
    color: var(--tl-color-brand, #2491eb);
    font-weight: var(--tl-font-weight-semibold);
  }
  .firm-card-actions {
    display: flex;
    flex-direction: column;
    gap: var(--tl-spacing-xs);
    flex-shrink: 0;
  }
</style>
