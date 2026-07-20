<script>
  import { client } from '../lib/sdk.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import Modal from '../components/Modal.svelte';

  let keyword = '';
  let state = '';
  let states = [];
  let certifications = [];
  let capabilities = [];
  let commodityCodes = [];
  let unions = [];
  let businessSizes = [];

  let selectedCerts = [];
  let selectedCapabilities = [];
  let selectedCommodityCodes = [];
  let selectedUnions = [];
  let selectedBusinessSizes = [];
  let selectedEthnicities = [];

  let showFilters = false;
  let collapsedFilters = {};

  function toggleFilterGroup(key) {
    collapsedFilters[key] = !collapsedFilters[key];
    collapsedFilters = collapsedFilters;
  }

  function filterCount(key) {
    const counts = {
      certifications: selectedCerts.length,
      capabilities: selectedCapabilities.length,
      businessSizes: selectedBusinessSizes.length,
      unions: selectedUnions.length,
      ethnicities: selectedEthnicities.length,
    };
    return counts[key] ?? 0;
  }

  let results = [];
  let loading = false;
  let searched = false;
  let error = '';
  let lookupView = 'search';
  let selectedCompany = null;
  let selectedCompanyData = null;
  let searchHistory = [];
  let activeSearch = null;
  let feedbackLoading = {};

  async function loadLookupData() {
    try {
      const [s, certs, caps, comm, u, bs] = await Promise.all([
        client.lookup.listStates().catch(() => []),
        client.lookup.listCertifications().catch(() => []),
        client.lookup.listCapabilities().catch(() => []),
        client.lookup.listCommodityCodes().catch(() => []),
        client.lookup.listUnions().catch(() => []),
        client.lookup.listBusinessSizes().catch(() => []),
      ]);
      states = s;
      certifications = certs;
      capabilities = caps;
      commodityCodes = comm;
      unions = u;
      businessSizes = bs;
    } catch {}
    loadHistory();
  }

  async function loadHistory() {
    try { searchHistory = await client.companies.listSearchHistory({ limit: 10 }); } catch {}
  }

  async function search() {
    if (!keyword && !state && !selectedCerts.length && !selectedCapabilities.length) return;
    loading = true;
    searched = true;
    error = '';
    try {
      const filter = {};
      if (keyword) filter.keyword = keyword;
      if (state) filter.states = [state];
      if (selectedCerts.length) filter.certification_ids = selectedCerts;
      if (selectedCapabilities.length) filter.capability_ids = selectedCapabilities;
      if (selectedCommodityCodes.length) filter.commodity_code_ids = selectedCommodityCodes;
      if (selectedUnions.length) filter.union_ids = selectedUnions;
      if (selectedBusinessSizes.length) filter.business_sizes = selectedBusinessSizes;
      if (selectedEthnicities.length) filter.ethnicities = selectedEthnicities;
      const data = await client.companies.search(filter, { fresh: true });
      results = data.results ?? [];
      activeSearch = data;
      await loadHistory();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Search failed';
      results = [];
    } finally {
      loading = false;
    }
  }

  async function openHistorySearch(searchId) {
    loading = true;
    searched = true;
    error = '';
    try {
      const data = await client.companies.getSearchResults(searchId);
      results = data.results ?? [];
      activeSearch = data;
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load search';
      results = [];
    } finally {
      loading = false;
    }
  }

  async function openCompany(id) {
    lookupView = 'company';
    selectedCompany = id;
    try {
      selectedCompanyData = await client.companies.get(id);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load company';
    }
  }

  async function markFeedback(companyId, score) {
    if (!activeSearch?.id) return;
    feedbackLoading[companyId] = true;
    try {
      if (score === -1) {
        await client.companies.saveFeedback(activeSearch.id, companyId, { score: -1, failure_criteria: { user_flagged: true } });
      } else {
        await client.companies.clearFeedback(activeSearch.id, companyId);
      }
      const refreshed = await client.companies.getSearchResults(activeSearch.id, { staleTime: 0 });
      results = refreshed.results ?? [];
    } catch (e) {
      error = e instanceof Error ? e.message : 'Feedback failed';
    } finally {
      feedbackLoading[companyId] = false;
    }
  }

  function isExcluded(companyId) {
    return activeSearch?.results_feedback?.some((f) => f.matched_company_id === companyId && f.score === -1);
  }

  function closeCompany() {
    lookupView = 'search';
    selectedCompany = null;
    selectedCompanyData = null;
  }

  function clearFilters() {
    selectedCerts = [];
    selectedCapabilities = [];
    selectedCommodityCodes = [];
    selectedUnions = [];
    selectedBusinessSizes = [];
    selectedEthnicities = [];
    state = '';
    keyword = '';
  }

  function toggleMulti(arr, value) {
    const idx = arr.indexOf(value);
    if (idx >= 0) arr.splice(idx, 1);
    else arr.push(value);
    arr = arr;
  }

  loadLookupData();
</script>

{#if lookupView === 'company' && selectedCompanyData}
  <div class="breadcrumb">
    <button class="breadcrumb-item" on:click={closeCompany}>Firm Lookup</button>
    <svg class="breadcrumb-sep" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
    <span class="breadcrumb-item active">{selectedCompanyData.company_name ?? 'Company'}</span>
  </div>

  <div class="detail-panel">
    <div class="detail-panel-header">
      <h2>{selectedCompanyData.company_name ?? 'Unknown'}</h2>
      <span class="badge">ID {selectedCompanyData.id}</span>
    </div>
    <div class="detail-panel-body">
      <dl class="detail-grid">
        <dt>Company ID</dt><dd class="mono">{selectedCompanyData.id}</dd>
        <dt>Type</dt><dd>{selectedCompanyData.company_type ?? '—'}</dd>
        {#if selectedCompanyData.city || selectedCompanyData.state}
          <dt>Location</dt><dd>{[selectedCompanyData.city, selectedCompanyData.state].filter(Boolean).join(', ')}</dd>
        {/if}
        {#if selectedCompanyData.phone}
          <dt>Phone</dt><dd>{selectedCompanyData.phone}</dd>
        {/if}
        {#if selectedCompanyData.website}
          <dt>Website</dt><dd><a href={selectedCompanyData.website} target="_blank" rel="noopener">{selectedCompanyData.website}</a></dd>
        {/if}
        {#if selectedCompanyData.revenue}
          <dt>Revenue</dt><dd>{selectedCompanyData.revenue}</dd>
        {/if}
        {#if selectedCompanyData.employee_count}
          <dt>Employees</dt><dd>{selectedCompanyData.employee_count}</dd>
        {/if}
      </dl>

      {#if selectedCompanyData.capabilities?.length}
        <div class="detail-section-title">Capabilities</div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--tl-spacing-xs)">
          {#each selectedCompanyData.capabilities as cap}
            <span class="tag-pill tag-pill-accent">{cap.name ?? cap}</span>
          {/each}
        </div>
      {/if}

      {#if selectedCompanyData.certifications?.length}
        <div class="detail-section-title">Certifications</div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--tl-spacing-xs)">
          {#each selectedCompanyData.certifications as cert}
            <span class="tag-pill tag-pill-success">{cert.name ?? cert.agency ?? cert}</span>
          {/each}
        </div>
      {/if}

      {#if selectedCompanyData.commodity_codes?.length}
        <div class="detail-section-title">Commodity Codes</div>
        <div style="display:flex;flex-wrap:wrap;gap:var(--tl-spacing-xs)">
          {#each selectedCompanyData.commodity_codes as cc}
            <span class="tag-pill">{cc.code ?? cc.name ?? cc}</span>
          {/each}
        </div>
      {/if}

      {#if selectedCompanyData.about}
        <div class="detail-section-title">About</div>
        <p style="font-size:var(--tl-font-size-sm);color:var(--tl-color-text-on-surface);line-height:var(--tl-line-height-normal)">
          {selectedCompanyData.about}
        </p>
      {/if}
    </div>
  </div>
{:else if lookupView === 'search'}
  <div style="display:flex;justify-content:flex-end;margin-bottom:var(--tl-spacing-md)">
    <button class="btn btn-secondary btn-sm" on:click={() => (showFilters = !showFilters)}>
      {showFilters ? 'Close' : 'Filters'}
    </button>
  </div>

  <div class="toolbar">
    <div class="search-input">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input type="text" bind:value={keyword} placeholder="Search by name or keyword" on:keydown={(e) => e.key === 'Enter' && search()} />
    </div>
    <select class="filter-select" bind:value={state}>
      <option value="">All states</option>
      {#each states as s}<option value={s.abbr}>{s.name} ({s.abbr})</option>{/each}
    </select>
    <button class="btn btn-primary" on:click={search} disabled={loading}>
      {loading ? 'Searching…' : 'Search'}
    </button>
  </div>

  <Modal show={showFilters} title="Advanced Filters" on:close={() => (showFilters = false)} maxWidth={560}>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--tl-spacing-md)">
        <div style="font-size:var(--tl-font-size-sm);color:var(--tl-color-text-on-surface)">Filter firms by certifications, capabilities, and more</div>
        <button class="btn btn-ghost btn-sm" on:click={clearFilters}>Clear all</button>
      </div>

      {#if certifications.length}
        <div class="filter-group">
          <button class="filter-group-toggle" on:click={() => toggleFilterGroup('certifications')}>
            <span class="filter-group-label">Certifications</span>
            {#if filterCount('certifications') > 0}<span class="filter-group-count">{filterCount('certifications')}</span>{/if}
            <svg class="filter-chevron" class:rotated={collapsedFilters.certifications} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {#if !collapsedFilters.certifications}
            <div class="filter-chips">
              {#each certifications as cert}
                <button class="filter-chip" class:selected={selectedCerts.includes(cert.id)}
                  on:click={() => toggleMulti(selectedCerts, cert.id)}>
                  {cert.name ?? cert.agency ?? `Cert ${cert.id}`}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      {#if capabilities.length}
        <div class="filter-group">
          <button class="filter-group-toggle" on:click={() => toggleFilterGroup('capabilities')}>
            <span class="filter-group-label">Capabilities</span>
            {#if filterCount('capabilities') > 0}<span class="filter-group-count">{filterCount('capabilities')}</span>{/if}
            <svg class="filter-chevron" class:rotated={collapsedFilters.capabilities} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {#if !collapsedFilters.capabilities}
            <div class="filter-chips">
              {#each capabilities as cap}
                <button class="filter-chip" class:selected={selectedCapabilities.includes(cap.id)}
                  on:click={() => toggleMulti(selectedCapabilities, cap.id)}>
                  {cap.name}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      {#if businessSizes.length}
        <div class="filter-group">
          <button class="filter-group-toggle" on:click={() => toggleFilterGroup('businessSizes')}>
            <span class="filter-group-label">Business Sizes</span>
            {#if filterCount('businessSizes') > 0}<span class="filter-group-count">{filterCount('businessSizes')}</span>{/if}
            <svg class="filter-chevron" class:rotated={collapsedFilters.businessSizes} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {#if !collapsedFilters.businessSizes}
            <div class="filter-chips">
              {#each businessSizes as bs}
                <button class="filter-chip" class:selected={selectedBusinessSizes.includes(bs.code)}
                  on:click={() => toggleMulti(selectedBusinessSizes, bs.code)}>
                  {bs.text}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      {#if unions.length}
        <div class="filter-group">
          <button class="filter-group-toggle" on:click={() => toggleFilterGroup('unions')}>
            <span class="filter-group-label">Unions</span>
            {#if filterCount('unions') > 0}<span class="filter-group-count">{filterCount('unions')}</span>{/if}
            <svg class="filter-chevron" class:rotated={collapsedFilters.unions} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {#if !collapsedFilters.unions}
            <div class="filter-chips">
              {#each unions as u}
                <button class="filter-chip" class:selected={selectedUnions.includes(u.id)}
                  on:click={() => toggleMulti(selectedUnions, u.id)}>
                  {u.name ?? `Union ${u.id}`}
                </button>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <div class="filter-group">
        <button class="filter-group-toggle" on:click={() => toggleFilterGroup('ethnicities')}>
          <span class="filter-group-label">Ethnicities</span>
          {#if filterCount('ethnicities') > 0}<span class="filter-group-count">{filterCount('ethnicities')}</span>{/if}
          <svg class="filter-chevron" class:rotated={collapsedFilters.ethnicities} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        {#if !collapsedFilters.ethnicities}
          <div class="filter-chips">
            {#each ['Asian', 'Black', 'Hispanic', 'Native American', 'White', 'Other'] as eth}
              <button class="filter-chip" class:selected={selectedEthnicities.includes(eth)}
                on:click={() => toggleMulti(selectedEthnicities, eth)}>
                {eth}
              </button>
            {/each}
          </div>
        {/if}
      </div>

      <svelte:fragment slot="footer">
        <button class="btn btn-secondary btn-sm" on:click={() => (showFilters = false)}>Cancel</button>
        <button class="btn btn-primary btn-sm" on:click={search} disabled={loading}>
          {loading ? 'Searching…' : 'Apply & Search'}
        </button>
      </svelte:fragment>
    </Modal>

  {#if error}<div class="form-error">{error}</div>{/if}

  {#if searchHistory.length > 0 && !searched}
    <div class="detail-section-title">Recent Searches</div>
    <div class="detail-panel" style="margin-bottom:var(--tl-spacing-xl)">
      <table class="data-table">
        <thead><tr><th>Filter</th><th>Results</th><th>Date</th></tr></thead>
        <tbody>
          {#each searchHistory as hist}
            <tr on:click={() => openHistorySearch(hist.id)} role="button" tabindex="0"
                on:keydown={(e) => e.key === 'Enter' && openHistorySearch(hist.id)}>
              <td class="primary">{hist.filter?.keyword || hist.filter?.states?.join(', ') || 'Search ' + hist.id.slice(-6)}</td>
              <td class="secondary mono">{hist.results_count ?? hist.results?.length ?? '—'}</td>
              <td class="secondary">{hist.created_at ? new Date(hist.created_at).toLocaleDateString() : '—'}</td>
            </tr>
          {/each}
        </tbody>
      </table>
      <div class="list-view">
        {#each searchHistory as hist}
          <div class="list-item" on:click={() => openHistorySearch(hist.id)} role="button" tabindex="0"
               on:keydown={(e) => e.key === 'Enter' && openHistorySearch(hist.id)}>
            <div class="list-item-main">
              <div class="list-item-title">{hist.filter?.keyword || hist.filter?.states?.join(', ') || 'Search ' + hist.id.slice(-6)}</div>
              <div class="list-item-meta">
                <span>{hist.results_count ?? hist.results?.length ?? '—'} results</span>
                {#if hist.created_at}<span>{new Date(hist.created_at).toLocaleDateString()}</span>{/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  {#if loading}
    <div class="detail-panel">
      <SkeletonTable rows={6} columns={3} />
    </div>
    <div class="list-view">
      <SkeletonList items={6} lines={1} avatar={false} />
    </div>
  {:else if searched && results.length === 0}
    <div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p class="empty-state-title">No firms found</p>
      <p class="empty-state-desc">Try adjusting your search criteria.</p>
    </div>
  {:else if results.length > 0}
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Company Name</th><th>ID</th><th style="text-align:right">Feedback</th></tr></thead>
        <tbody>
          {#each results as company}
            <tr>
              <td class="primary" style="cursor:pointer" on:click={() => openCompany(company.id)}>{company.company_name ?? 'Unknown'}</td>
              <td class="secondary mono">{company.id}</td>
              <td style="text-align:right;white-space:nowrap">
                {#if isExcluded(company.id)}
                  <button class="btn btn-ghost btn-sm" on:click={() => markFeedback(company.id, 0)} disabled={feedbackLoading[company.id]}>
                    {feedbackLoading[company.id] ? '…' : 'Restore'}
                  </button>
                {:else}
                  <button class="btn btn-ghost btn-sm" on:click={() => markFeedback(company.id, -1)} disabled={feedbackLoading[company.id]} style="color:var(--tl-color-neutral-500)">
                    {feedbackLoading[company.id] ? '…' : 'Exclude'}
                  </button>
                {/if}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      <div class="list-view">
        {#each results as company}
          <div class="list-item">
            <div class="list-item-main" style="cursor:pointer" on:click={() => openCompany(company.id)} role="button" tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && openCompany(company.id)}>
              <div class="list-item-title">{company.company_name ?? 'Unknown'}</div>
              <div class="list-item-meta"><span>ID: {company.id}</span></div>
            </div>
            <div>
              {#if isExcluded(company.id)}
                <button class="btn btn-ghost btn-sm" on:click={() => markFeedback(company.id, 0)} disabled={feedbackLoading[company.id]}>
                  {feedbackLoading[company.id] ? '…' : 'Restore'}
                </button>
              {:else}
                <button class="btn btn-ghost btn-sm" on:click={() => markFeedback(company.id, -1)} disabled={feedbackLoading[company.id]} style="color:var(--tl-color-neutral-500)">
                  {feedbackLoading[company.id] ? '…' : 'Exclude'}
                </button>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else if !searched}
    <div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p class="empty-state-title">Search for firms</p>
      <p class="empty-state-desc">Enter a name or use filters to get started.</p>
    </div>
  {/if}
{/if}
