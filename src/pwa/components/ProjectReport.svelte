<script>
  import { auditReady, outreachFunnel, goalVsActual, participationBreakdown } from '../lib/reporting.js';

  export let project = null;
  export let participants = [];
  export let surveys = [];
  export let loading = false;

  $: audit = project ? auditReady(project, participants, surveys) : null;
  $: funnel = surveys.length ? outreachFunnel(surveys) : null;
  $: goal = project ? goalVsActual(project, surveys) : null;
  $: breakdown = project ? participationBreakdown(participants, surveys, project) : null;

  const funnelLabels = {
    invited: 'Invited',
    viewed: 'Viewed',
    interested: 'Interested',
    submitted: 'Submitted',
    awarded: 'Awarded',
  };
  const funnelOrder = ['invited', 'viewed', 'interested', 'submitted', 'awarded'];

  function formatCurrency(v) {
    if (v == null) return '—';
    return `$${Number(v).toLocaleString()}`;
  }
</script>

{#if loading}
  <div class="report-section">
    <div class="report-skeleton"></div>
    <div class="report-skeleton"></div>
  </div>
{:else if !project}
  <div class="empty-state">
    <p class="empty-state-title">No project data</p>
  </div>
{:else}
  <div class="report-section">
    <h3 class="report-heading">Compliance Checklist</h3>
    {#if audit}
      <div class="audit-summary" class:passed={audit.passed}>
        <span class="audit-badge" class:passed={audit.passed}>
          {#if audit.passed}Audit Ready{:else}{audit.criticalMissing} critical {/if}
        </span>
      </div>
      <ul class="audit-checklist">
        {#each audit.checklist as item}
          <li class="audit-item" class:pass={item.passed} class:fail={!item.passed} class:critical={item.critical && !item.passed}>
            <span class="audit-icon">{#if item.passed}&#10003;{:else}&#9711;{/if}</span>
            <span class="audit-label">{item.label}</span>
            {#if !item.passed && item.critical}<span class="audit-tag">critical</span>{/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>

  {#if goal}
    <div class="report-section">
      <h3 class="report-heading">Participation Goal</h3>
      {#if goal.rawGoal}
        <div class="goal-row">
          <div class="goal-cell">
            <div class="goal-label">Stated goal</div>
            <div class="goal-value">{goal.rawGoal}</div>
          </div>
          {#if goal.parseable}
            <div class="goal-cell">
              <div class="goal-label">Target</div>
              <div class="goal-value mono">{goal.goalPercent}%{#if goal.goalType} {goal.goalType}{/if}</div>
            </div>
            <div class="goal-cell">
              <div class="goal-label">Actual diverse</div>
              <div class="goal-value mono">
                {#if goal.actualPercent != null}{goal.actualPercent}%{:else}—{/if}
              </div>
            </div>
            {#if goal.hasAwards}
              <div class="goal-cell">
                <div class="goal-label">Awarded</div>
                <div class="goal-value mono">
                  {formatCurrency(goal.diverseAwarded)} / {formatCurrency(goal.totalAwarded)}
                </div>
              </div>
            {/if}
          {/if}
        </div>
        {#if !goal.parseable && goal.hasAwards}
          <p class="muted-note">Goal string could not be parsed. {formatCurrency(goal.totalAwarded)} awarded total; diverse share unknown without a structured goal.</p>
        {/if}
        {#if !goal.hasAwards}
          <p class="muted-note">No awards recorded yet; actual diverse participation will appear once bid packages are awarded.</p>
        {/if}
      {:else}
        <p class="muted-note">No participation goal set for this project.</p>
      {/if}
    </div>
  {/if}

  {#if funnel}
    <div class="report-section">
      <h3 class="report-heading">Outreach Funnel</h3>
      {#if funnel.total === 0}
        <p class="muted-note">No outreach surveys yet.</p>
      {:else}
        <div class="funnel">
          {#each funnelOrder as stage, i}
            {@const count = funnel.counts[stage]}
            {@const prevCount = i > 0 ? funnel.counts[funnelOrder[i - 1]] : 0}
            {@const width = funnel.counts.invited > 0 ? Math.max(8, Math.round((count / funnel.counts.invited) * 100)) : 0}
            <div class="funnel-row">
              <div class="funnel-bar" style="width:{width}%">
                <span class="funnel-stage">{funnelLabels[stage]}</span>
                <span class="funnel-count">{count}</span>
              </div>
              {#if i > 0 && funnel.rates[stage] != null}
                <span class="funnel-rate">{funnel.rates[stage]}%</span>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}

  {#if breakdown && breakdown.groups.length > 0}
    <div class="report-section">
      <h3 class="report-heading">Participation by Certification</h3>
      {#if breakdown.gaps.length > 0}
        <div class="cert-gap-notice">
          Certification gaps: {breakdown.gaps.map((g) => g.type).join(', ')}
        </div>
      {/if}
      <div class="cert-grid">
        {#each breakdown.groups as g}
          <div class="cert-card" class:required={g.required} class:gap={g.firms.length === 0}>
            <div class="cert-card-header">
              <span class="cert-type">{g.type}</span>
              {#if g.required}<span class="cert-required-tag">required</span>{/if}
            </div>
            <div class="cert-card-body">
              <span class="cert-firm-count">{g.firms.length} firms</span>
              {#if g.awarded > 0}<span class="cert-awarded">{g.awarded} awarded</span>{/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
{/if}

<style>
  .report-section {
    margin-bottom: var(--tl-spacing-xl);
  }
  .report-heading {
    font-size: var(--tl-font-size-base);
    font-weight: var(--tl-font-weight-semibold);
    margin-bottom: var(--tl-spacing-sm);
  }
  .report-skeleton {
    height: 120px;
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-lg);
    margin-bottom: var(--tl-spacing-md);
    animation: pulse 1.5s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .audit-summary {
    margin-bottom: var(--tl-spacing-sm);
  }
  .audit-badge {
    display: inline-block;
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    border-radius: var(--tl-border-radius-lg);
    background: var(--tl-color-neutral-100);
    color: var(--tl-color-neutral-700);
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-semibold);
  }
  .audit-badge.passed {
    background: var(--tl-color-success-bg, #dcfce7);
    color: #15803d;
  }
  .audit-checklist {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .audit-item {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    padding: var(--tl-spacing-xs) 0;
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    font-size: var(--tl-font-size-sm);
  }
  .audit-icon {
    width: 20px;
    text-align: center;
    flex-shrink: 0;
  }
  .audit-item.pass .audit-icon { color: #15803d; }
  .audit-item.fail .audit-icon { color: var(--tl-color-neutral-400); }
  .audit-item.critical .audit-icon { color: #dc2626; }
  .audit-label { flex: 1; }
  .audit-tag {
    font-size: var(--tl-font-size-xs);
    color: #dc2626;
    text-transform: uppercase;
    font-weight: var(--tl-font-weight-semibold);
  }

  .goal-row {
    display: flex;
    flex-wrap: wrap;
    gap: var(--tl-spacing-md);
    padding: var(--tl-spacing-md);
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-lg);
  }
  .goal-cell { flex: 1 1 120px; }
  .goal-label {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    text-transform: uppercase;
    margin-bottom: 2px;
  }
  .goal-value {
    font-size: var(--tl-font-size-base);
    font-weight: var(--tl-font-weight-semibold);
  }

  .funnel {
    display: flex;
    flex-direction: column;
    gap: var(--tl-spacing-xs);
  }
  .funnel-row {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
  }
  .funnel-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    background: var(--tl-color-brand, #2491eb);
    color: #fff;
    border-radius: var(--tl-border-radius-md);
    font-size: var(--tl-font-size-sm);
    min-width: 80px;
    transition: width 0.3s ease;
  }
  .funnel-rate {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
    white-space: nowrap;
  }

  .cert-gap-notice {
    padding: var(--tl-spacing-xs) var(--tl-spacing-sm);
    background: #fef3c7;
    border-radius: var(--tl-border-radius-md);
    font-size: var(--tl-font-size-sm);
    margin-bottom: var(--tl-spacing-sm);
  }
  .cert-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: var(--tl-spacing-sm);
  }
  .cert-card {
    padding: var(--tl-spacing-sm);
    border: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    border-radius: var(--tl-border-radius-lg);
  }
  .cert-card.required {
    border-color: var(--tl-color-brand, #2491eb);
  }
  .cert-card.gap {
    background: #fef3c7;
    border-color: #f59e0b;
  }
  .cert-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--tl-spacing-xs);
  }
  .cert-type {
    font-weight: var(--tl-font-weight-semibold);
    font-size: var(--tl-font-size-sm);
  }
  .cert-required-tag {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--tl-color-brand, #2491eb);
    font-weight: var(--tl-font-weight-semibold);
  }
  .cert-card-body {
    display: flex;
    gap: var(--tl-spacing-xs);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
  }
  .cert-awarded { color: #15803d; font-weight: var(--tl-font-weight-semibold); }
</style>
