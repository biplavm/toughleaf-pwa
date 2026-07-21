<script>
  import { onDestroy } from 'svelte';
  import { client } from '../lib/sdk.js';
  import { buildOutreachContext, outreachBadge } from '../lib/reporting.js';
  import { enrichmentStore } from '../lib/enrichment-store.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import Modal from '../components/Modal.svelte';
  import EnrichButton from '../components/EnrichButton.svelte';
  import EnrichReviewSheet from '../components/EnrichReviewSheet.svelte';

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

  let outreachContext = null;
  let outreachLoading = false;
  let onlyNewFirms = false;

  let showAddToProject = false;
  let addToProjectCompany = null;
  let addToProjectProjects = [];
  let addToProjectSelected = null;
  let addToProjectLoading = false;
  let addToProjectError = '';
  let addToProjectSuccess = '';

  let enrichReviewCompanyId = null;
  let enrichReviewShow = false;
  let enrichStates = {};

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
      if (results.length > 0) loadOutreachContext();
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

  async function loadOutreachContext() {
    outreachLoading = true;
    try {
      const projects = await client.projects.list(undefined, { staleTime: 60_000 });
      const surveyPromises = projects.map((p) =>
        client.projects.listSurveys(p.id, undefined, { staleTime: 60_000 }).catch(() => [])
      );
      const results = await Promise.all(surveyPromises);
      outreachContext = buildOutreachContext(results.flat());
    } catch {
      outreachContext = null;
    } finally {
      outreachLoading = false;
    }
  }

  function badgeForCompany(companyId) {
    if (!outreachContext) return null;
    return outreachBadge(outreachContext, companyId);
  }

  async function openAddToProject(company) {
    addToProjectCompany = company;
    addToProjectSelected = null;
    addToProjectError = '';
    addToProjectSuccess = '';
    showAddToProject = true;
    try {
      addToProjectProjects = await client.projects.list(undefined, { staleTime: 30_000 });
    } catch {
      addToProjectProjects = [];
    }
  }

  async function confirmAddToProject() {
    if (!addToProjectSelected || !addToProjectCompany) return;
    addToProjectLoading = true;
    addToProjectError = '';
    try {
      await client.projects.addParticipants(addToProjectSelected, [{
        company_id: addToProjectCompany.id,
      }]);
      addToProjectSuccess = `${addToProjectCompany.company_name ?? 'Firm'} added to project.`;
      if (outreachContext) {
        const entry = outreachContext.get(addToProjectCompany.id);
        if (entry) {
          entry.contacted = true;
          entry.invitedCount++;
        }
      }
    } catch (e) {
      addToProjectError = e instanceof Error ? e.message : 'Failed to add firm to project';
    } finally {
      addToProjectLoading = false;
    }
  }

  function closeAddToProject() {
    showAddToProject = false;
    addToProjectCompany = null;
    addToProjectSelected = null;
    addToProjectError = '';
    addToProjectSuccess = '';
  }

  const unsubEnrich = enrichmentStore.subscribe((states) => {
    enrichStates = states;
  });

  onDestroy(() => unsubEnrich());

  function openEnrichReview(companyId) {
    enrichReviewCompanyId = companyId;
    enrichReviewShow = true;
  }

  function closeEnrichReview() {
    enrichReviewShow = false;
    enrichReviewCompanyId = null;
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
    {#if outreachLoading}
      <div class="outreach-loading-bar">Checking outreach history…</div>
    {/if}

    <div class="lookup-results-toolbar">
      <label class="filter-toggle">
        <input type="checkbox" bind:checked={onlyNewFirms} />
        <span>Only show firms not yet contacted</span>
      </label>
    </div>

    {@const visibleResults = onlyNewFirms && outreachContext
      ? results.filter((c) => !outreachContext.has(c.id))
      : results}

    {#if visibleResults.length === 0}
      <div class="empty-state">
        <p class="empty-state-title">All firms already contacted</p>
        <p class="empty-state-desc">Every result has been invited to at least one project.</p>
      </div>
    {:else}
    <div class="detail-panel">
      <table class="data-table">
        <thead><tr><th>Company Name</th><th>Outreach</th><th>Enrich</th><th style="text-align:right">Actions</th></tr></thead>
        <tbody>
          {#each visibleResults as company}
            {@const badge = badgeForCompany(company.id)}
            {@const enrichState = enrichStates[company.id]}
            <tr>
              <td class="primary" style="cursor:pointer" on:click={() => openCompany(company.id)}>{company.company_name ?? 'Unknown'}</td>
              <td class="secondary">
                {#if badge}
                  <span class="badge badge-{badge.tone === 'success' ? 'success' : badge.tone === 'accent' ? 'accent' : ''}">{badge.label}</span>
                {:else}
                  <span class="badge">—</span>
                {/if}
              </td>
              <td>
                {#if enrichState?.status === 'ready'}
                  <button class="enrich-btn enrich-btn-primary" on:click={() => openEnrichReview(company.id)}>Review</button>
                {:else}
                  <EnrichButton companyId={company.id} companyName={company.company_name} website={company.website} />
                {/if}
              </td>
              <td style="text-align:right;white-space:nowrap">
                <button class="btn btn-ghost btn-sm" on:click={() => openAddToProject(company)}>Add to project</button>
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
        {#each visibleResults as company}
          {@const badge = badgeForCompany(company.id)}
          {@const enrichState = enrichStates[company.id]}
          <div class="list-item">
            <div class="list-item-main" style="cursor:pointer" on:click={() => openCompany(company.id)} role="button" tabindex="0"
                 on:keydown={(e) => e.key === 'Enter' && openCompany(company.id)}>
              <div class="list-item-title">{company.company_name ?? 'Unknown'}</div>
              <div class="list-item-meta">
                <span>ID: {company.id}</span>
                {#if badge}<span class="badge badge-{badge.tone === 'success' ? 'success' : badge.tone === 'accent' ? 'accent' : ''}">{badge.label}</span>{/if}
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:var(--tl-spacing-xs);align-items:flex-end">
              {#if enrichState?.status === 'ready'}
                <button class="enrich-btn enrich-btn-primary" on:click={() => openEnrichReview(company.id)}>Review</button>
              {:else}
                <EnrichButton companyId={company.id} companyName={company.company_name} website={company.website} />
              {/if}
              <button class="btn btn-ghost btn-sm" on:click={() => openAddToProject(company)}>Add to project</button>
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
    {/if}
  {:else if !searched}
    <div class="empty-state">
      <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <p class="empty-state-title">Search for firms</p>
      <p class="empty-state-desc">Enter a name or use filters to get started.</p>
    </div>
  {/if}
{/if}

<Modal show={showAddToProject} title="Add to Project" on:close={closeAddToProject} maxWidth={480}>
  {#if addToProjectSuccess}
    <div class="form-success">{addToProjectSuccess}</div>
  {:else}
    <p style="font-size:var(--tl-font-size-sm);color:var(--tl-color-text-on-surface);margin-bottom:var(--tl-spacing-md)">
      Add <strong>{addToProjectCompany?.company_name ?? 'this firm'}</strong> to a project as a participant.
    </p>
    {#if addToProjectError}<div class="form-error">{addToProjectError}</div>{/if}
    <div class="form-field">
      <label for="addToProjectSelect">Select project</label>
      <select id="addToProjectSelect" bind:value={addToProjectSelected} disabled={addToProjectLoading}>
        <option value={null}>Choose a project…</option>
        {#each addToProjectProjects as proj}
          <option value={proj.id}>{proj.name ?? 'Untitled'}</option>
        {/each}
      </select>
    </div>
  {/if}

  <svelte:fragment slot="footer">
    {#if addToProjectSuccess}
      <button class="btn btn-primary btn-sm" on:click={closeAddToProject}>Done</button>
    {:else}
      <button class="btn btn-secondary btn-sm" on:click={closeAddToProject} disabled={addToProjectLoading}>Cancel</button>
      <button class="btn btn-primary btn-sm" on:click={confirmAddToProject} disabled={!addToProjectSelected || addToProjectLoading}>
        {addToProjectLoading ? 'Adding…' : 'Add to Project'}
      </button>
    {/if}
  </svelte:fragment>
</Modal>

<EnrichReviewSheet show={enrichReviewShow} companyId={enrichReviewCompanyId} on:applied={closeEnrichReview} on:dismissed={closeEnrichReview} />

<style>
  .outreach-loading-bar {
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-md);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    margin-bottom: var(--tl-spacing-sm);
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
  }
  .outreach-loading-bar::before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 2px solid var(--tl-color-neutral-200);
    border-top-color: var(--tl-color-brand, #2491eb);
    border-radius: 50%;
    animation: outreach-spin 0.8s linear infinite;
  }
  @keyframes outreach-spin { to { transform: rotate(360deg); } }

  .lookup-results-toolbar {
    margin-bottom: var(--tl-spacing-sm);
  }
  .filter-toggle {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-600);
    cursor: pointer;
  }
  .filter-toggle input { cursor: pointer; }

  .form-success {
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    background: #dcfce7;
    border-radius: var(--tl-border-radius-md);
    color: #15803d;
    font-size: var(--tl-font-size-sm);
  }

  .enrich-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    border: var(--tl-border-width-thin) solid transparent;
    border-radius: var(--tl-border-radius-lg);
    font-size: var(--tl-font-size-xs);
    font-weight: var(--tl-font-weight-medium);
    cursor: pointer;
    white-space: nowrap;
    min-height: 32px;
  }
  .enrich-btn-primary {
    background: var(--tl-color-brand, #2491eb);
    color: #fff;
  }
  .enrich-btn-primary:hover {
    background: #1a7dd4;
  }
</style>
