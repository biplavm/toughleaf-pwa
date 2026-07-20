<script>
  import { client } from '../lib/sdk.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';

  let loading = true;
  let error = '';
  let allSurveys = [];
  let activeTab = 'action';
  let keyword = '';

  const tabs = [
    { id: 'action',    label: 'Action Required' },
    { id: 'today',     label: 'Due Today' },
    { id: 'week',      label: 'Due This Week' },
    { id: 'past',      label: 'Past Due' },
    { id: 'all',       label: 'All' },
  ];

  async function loadOutreach() {
    loading = true;
    error = '';
    try {
      const projects = await client.projects.list(undefined, { staleTime: 30_000 });
      const surveyPromises = projects.map((p) =>
        client.projects.listSurveys(p.id, undefined, { staleTime: 60_000 })
          .then((surveys) => surveys.map((s) => ({ ...s, project_name: p.name, project_id: p.id })))
          .catch(() => [])
      );
      const results = await Promise.all(surveyPromises);
      allSurveys = results.flat();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load outreach';
    } finally {
      loading = false;
    }
  }

  function isToday(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }

  function isThisWeek(dateStr) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    const diff = (d - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }

  function isPastDue(dateStr) {
    if (!dateStr) return false;
    return new Date(dateStr) < new Date() && !isToday(dateStr);
  }

  function needsAction(s) {
    return s.invitation_status === 'invited' || s.workflow_step_id || s.workflow_prompt?.action_required;
  }

  $: filtered = allSurveys.filter((s) => {
    if (keyword) {
      const name = s.participant?.company_name ?? `Company ${s.company_id}`;
      const projName = s.project_name ?? '';
      if (!name.toLowerCase().includes(keyword.toLowerCase()) &&
          !projName.toLowerCase().includes(keyword.toLowerCase())) return false;
    }
    if (activeTab === 'action') return needsAction(s);
    if (activeTab === 'today')  return isToday(s.workflow_step?.due_date) || isToday(s.survey_due_date);
    if (activeTab === 'week')   return isThisWeek(s.workflow_step?.due_date) || isThisWeek(s.survey_due_date);
    if (activeTab === 'past')   return isPastDue(s.workflow_step?.due_date) || isPastDue(s.survey_due_date);
    return true;
  });

  function workflowLabel(s) {
    if (s.workflow_step?.label) {
      const prompt = s.workflow_prompt?.label;
      return prompt ? `${s.workflow_step.label} — ${prompt}` : s.workflow_step.label;
    }
    return s.invitation_status ?? '—';
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  loadOutreach();
</script>



<div class="outreach-tabs">
  {#each tabs as tab}
    <button class="outreach-tab" class:active={activeTab === tab.id} on:click={() => (activeTab = tab.id)}>
      {tab.label}
    </button>
  {/each}
</div>

<div class="toolbar">
  <div class="search-input">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="text" bind:value={keyword} placeholder="Search by company or project name" />
  </div>
</div>

{#if loading}
  <div class="section-header">
    <h3>Results</h3>
  </div>
  <div class="detail-panel">
    <SkeletonTable rows={6} columns={5} />
  </div>
  <div class="list-view">
    <SkeletonList items={6} lines={3} />
  </div>
{:else if error}
  <div class="empty-state"><p class="empty-state-title">{error}</p></div>
{:else if filtered.length === 0}
  <div class="empty-state">
    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <p class="empty-state-title">All caught up</p>
    <p class="empty-state-desc">No outreach items in this category.</p>
  </div>
{:else}
  <div class="section-header">
    <h3>Results <span class="count">({filtered.length})</span></h3>
  </div>

  <div class="detail-panel">
    <table class="data-table">
      <thead>
        <tr><th>Company</th><th>Project</th><th>Workflow Step</th><th>Status</th><th>Due</th></tr>
      </thead>
      <tbody>
        {#each filtered as s}
          <tr>
            <td class="primary">{s.participant?.company_name ?? `Company ${s.company_id}`}</td>
            <td class="secondary">{s.project_name ?? '—'}</td>
            <td class="secondary">{workflowLabel(s)}</td>
            <td>
              <span class="badge badge-{s.invitation_status === 'accepted' ? 'success' : s.invitation_status === 'invited' ? 'accent' : ''}">
                {s.invitation_status ?? 'pending'}
              </span>
            </td>
            <td class="secondary mono">{formatDate(s.workflow_step?.due_date ?? s.survey_due_date)}</td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="list-view">
      {#each filtered as s}
        <div class="list-item">
          <div class="list-item-main">
            <div class="list-item-title">{s.participant?.company_name ?? `Company ${s.company_id}`}</div>
            <div class="list-item-meta">
              <span>{s.project_name ?? '—'}</span>
              <span>{workflowLabel(s)}</span>
              <span>Due {formatDate(s.workflow_step?.due_date ?? s.survey_due_date)}</span>
            </div>
          </div>
          <span class="badge badge-{s.invitation_status === 'accepted' ? 'success' : s.invitation_status === 'invited' ? 'accent' : ''}">
            {s.invitation_status ?? 'pending'}
          </span>
        </div>
      {/each}
    </div>
  </div>
{/if}
