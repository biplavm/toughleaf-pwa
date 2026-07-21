<script>
  import { onDestroy } from 'svelte';
  import { createEventDispatcher } from 'svelte';
  import {
    samStore,
    runStatusLabel,
    runStatusTone,
    runDurationLabel,
    formatJson,
    MESSAGE_ROLE_LABELS,
    LOG_TYPE_LABELS,
  } from '../lib/sam-store.js';

  export let project = null;

  const dispatch = createEventDispatcher();

  let state = {};
  let activeTab = 'messages';
  let showConfirm = false;
  let triggering = false;
  let expandedMessages = new Set();
  let expandedLogs = new Set();

  const unsub = samStore.subscribe((s) => { state = s; });

  onDestroy(() => {
    unsub();
    import('../lib/sam-store.js').then((m) => m.stopPolling());
  });

  $: currentRun = state.currentRun;
  $: currentLogs = state.currentLogs;
  $: runs = state.runs;
  $: polling = state.polling;
  $: error = state.error;
  $: messages = currentRun?.messages ?? [];

  function toggleMessage(idx) {
    const next = new Set(expandedMessages);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    expandedMessages = next;
  }

  function toggleLog(idx) {
    const next = new Set(expandedLogs);
    if (next.has(idx)) next.delete(idx); else next.add(idx);
    expandedLogs = next;
  }

  async function handleTrigger() {
    showConfirm = false;
    triggering = true;
    await samStore.triggerRun(project);
    triggering = false;
  }

  function handleViewRun(runId) {
    samStore.viewRun(runId);
  }

  function handleBack() {
    samStore.clearCurrentRun();
  }

  function handleRetry() {
    if (currentRun) samStore.triggerRun(project);
  }

  function handleClose() {
    dispatch('close');
  }

  function formatTime(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }

  function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  $: hasRuns = runs.length > 0;
</script>

<div class="sam-view">
  {#if currentRun}
    <div class="sam-run-detail">
      <div class="sam-run-header">
        <button class="breadcrumb-item" on:click={handleBack}>← Back to runs</button>
      </div>

      <div class="sam-run-status-card">
        <div class="sam-run-status-row">
          <span class="sam-status-pill sam-status-{runStatusTone(currentRun.status)}">
            {#if polling}
              <span class="sam-live-dot"></span>
            {/if}
            {runStatusLabel(currentRun.status)}
          </span>
          <span class="sam-run-duration">{runDurationLabel(currentRun)}</span>
        </div>
        <div class="sam-run-meta">
          <span>Run #{currentRun.id}</span>
          <span>Trigger: {currentRun.trigger ?? 'manual'}</span>
          <span>Started: {formatTime(currentRun.started_at)}</span>
        </div>
      </div>

      {#if error}
        <div class="sam-error" role="alert">
          {error}
          {#if currentRun.status === 'failed'}
            <button class="btn btn-primary btn-sm" on:click={handleRetry} style="margin-left:var(--tl-spacing-sm)">Retry</button>
          {/if}
        </div>
      {/if}

      {#if currentRun.status === 'completed' && currentRun.output}
        <div class="sam-output">
          <div class="detail-section-title">Result</div>
          <div class="sam-output-content">{currentRun.output}</div>
        </div>
      {/if}

      <div class="sam-tabs">
        <button class="sam-tab" class:active={activeTab === 'messages'} on:click={() => (activeTab = 'messages')}>
          Messages ({messages.length})
        </button>
        <button class="sam-tab" class:active={activeTab === 'logs'} on:click={() => (activeTab = 'logs')}>
          Logs ({currentLogs.length})
        </button>
      </div>

      {#if activeTab === 'messages'}
        <div class="sam-message-list">
          {#if messages.length === 0}
            <div class="sam-empty">No messages yet.</div>
          {:else}
            {#each messages as msg, i}
              <div class="sam-message" class:expanded={expandedMessages.has(i)}>
                <button class="sam-message-header" on:click={() => toggleMessage(i)}>
                  <span class="sam-message-role sam-role-{msg.role}">
                    {MESSAGE_ROLE_LABELS[msg.role] ?? msg.role}
                  </span>
                  {#if msg.tool_name}
                    <span class="sam-message-tool">{msg.tool_name}</span>
                  {/if}
                  <span class="sam-message-seq">#{i + 1}</span>
                  <svg class="sam-chevron" class:rotated={expandedMessages.has(i)} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {#if expandedMessages.has(i)}
                  <div class="sam-message-body">
                    {#if msg.content}
                      <pre class="sam-pre">{msg.content}</pre>
                    {/if}
                    {#if msg.tool_arguments}
                      <div class="sam-tool-args">
                        <div class="sam-tool-label">Arguments:</div>
                        <pre class="sam-pre sam-pre-code">{formatJson(msg.tool_arguments)}</pre>
                      </div>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {:else if activeTab === 'logs'}
        <div class="sam-log-list">
          {#if currentLogs.length === 0}
            <div class="sam-empty">No logs yet.</div>
          {:else}
            {#each currentLogs as log, i}
              <div class="sam-log" class:expanded={expandedLogs.has(i)} class:sam-log-error={log.type === 'error'}>
                <button class="sam-log-header" on:click={() => toggleLog(i)}>
                  <span class="sam-log-dot sam-log-dot-{log.type}"></span>
                  <span class="sam-log-type">{LOG_TYPE_LABELS[log.type] ?? log.type}</span>
                  <span class="sam-log-time">{formatTime(log.observed_at)}</span>
                  <svg class="sam-chevron" class:rotated={expandedLogs.has(i)} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
                </button>
                {#if expandedLogs.has(i)}
                  <div class="sam-log-body">
                    {#if log.label}<div class="sam-log-label">{log.label}</div>{/if}
                    {#if log.payload}
                      <pre class="sam-pre sam-pre-code">{formatJson(log.payload)}</pre>
                    {/if}
                  </div>
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {/if}
    </div>
  {:else}
    <div class="sam-overview">
      <div class="sam-overview-header">
        <div>
          <h3>SAM Sourcing Agent</h3>
          <p class="sam-overview-desc">Trigger AI sourcing to find and match firms for this project's bid packages.</p>
        </div>
      </div>

      {#if error}
        <div class="sam-error" role="alert">{error}</div>
      {/if}

      <button class="btn btn-primary" on:click={() => (showConfirm = true)} disabled={triggering || polling}>
        {#if triggering}Starting...{:else if polling}Running...{:else}<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:4px"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z"/></svg>Run SAM{/if}
      </button>

      {#if hasRuns}
        <div class="detail-section-title" style="margin-top:var(--tl-spacing-lg)">Run History</div>
        <div class="sam-run-history">
          {#each runs.slice(0, 10) as run}
            <button class="sam-run-history-item" on:click={() => handleViewRun(run.id)}>
              <div class="sam-run-history-main">
                <span class="sam-status-pill sam-status-{runStatusTone(run.status)}">
                  {runStatusLabel(run.status)}
                </span>
                <span class="sam-run-history-meta">Run #{run.id} · {formatDate(run.started_at)}</span>
              </div>
              <div class="sam-run-history-side">
                <span class="sam-run-duration">{runDurationLabel(run)}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </button>
          {/each}
        </div>
      {:else if !state.loading}
        <div class="sam-empty" style="margin-top:var(--tl-spacing-lg)">No SAM runs yet for this project.</div>
      {/if}
    </div>
  {/if}
</div>

{#if showConfirm}
  <div class="sam-confirm-backdrop" on:click={() => (showConfirm = false)} role="button" tabindex="-1" aria-label="Cancel"></div>
  <div class="sam-confirm-dialog" role="dialog" aria-label="Confirm SAM run">
    <h4>Run SAM on this project?</h4>
    <p>SAM will analyze the bid packages, search for matching firms, and prepare sourcing suggestions. This may take a few minutes.</p>
    <div style="display:flex;gap:var(--tl-spacing-sm);justify-content:flex-end">
      <button class="btn btn-secondary btn-sm" on:click={() => (showConfirm = false)}>Cancel</button>
      <button class="btn btn-primary btn-sm" on:click={handleTrigger}>Run SAM</button>
    </div>
  </div>
{/if}

<style>
  .sam-view {
    margin-top: var(--tl-spacing-md);
  }
  .sam-overview-header {
    margin-bottom: var(--tl-spacing-md);
  }
  .sam-overview-header h3 {
    font-size: var(--tl-font-size-base);
    font-weight: var(--tl-font-weight-semibold);
    margin: 0 0 4px;
  }
  .sam-overview-desc {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
    margin: 0;
  }

  .sam-run-status-card {
    padding: var(--tl-spacing-md);
    background: var(--tl-color-neutral-50);
    border-radius: var(--tl-border-radius-lg);
    margin-bottom: var(--tl-spacing-md);
  }
  .sam-run-status-row {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-sm);
    margin-bottom: var(--tl-spacing-xs);
  }
  .sam-run-duration {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-500);
    font-variant-numeric: tabular-nums;
  }
  .sam-run-meta {
    display: flex;
    gap: var(--tl-spacing-sm);
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-400);
    flex-wrap: wrap;
  }

  .sam-status-pill {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px var(--tl-spacing-sm);
    border-radius: var(--tl-border-radius-lg);
    font-size: var(--tl-font-size-xs);
    font-weight: var(--tl-font-weight-semibold);
  }
  .sam-status-success { background: #dcfce7; color: #15803d; }
  .sam-status-error { background: #fee2e2; color: #dc2626; }
  .sam-status-info { background: #eff8ff; color: #2491eb; }
  .sam-status-muted { background: var(--tl-color-neutral-100); color: var(--tl-color-neutral-500); }

  .sam-live-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    animation: sam-pulse 1.5s ease-in-out infinite;
  }
  @keyframes sam-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

  .sam-error {
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    background: #fee2e2;
    border-radius: var(--tl-border-radius-md);
    color: #dc2626;
    font-size: var(--tl-font-size-sm);
    margin-bottom: var(--tl-spacing-md);
    display: flex;
    align-items: center;
  }

  .sam-output {
    margin-bottom: var(--tl-spacing-md);
  }
  .sam-output-content {
    padding: var(--tl-spacing-md);
    background: #f0fdf4;
    border-radius: var(--tl-border-radius-md);
    font-size: var(--tl-font-size-sm);
    white-space: pre-wrap;
  }

  .sam-tabs {
    display: flex;
    gap: var(--tl-spacing-xs);
    margin-bottom: var(--tl-spacing-md);
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-200);
  }
  .sam-tab {
    padding: var(--tl-spacing-sm) var(--tl-spacing-md);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: var(--tl-font-size-sm);
    font-weight: var(--tl-font-weight-medium);
    color: var(--tl-color-neutral-500);
    cursor: pointer;
    margin-bottom: -1px;
  }
  .sam-tab.active {
    color: var(--tl-color-brand, #2491eb);
    border-bottom-color: var(--tl-color-brand, #2491eb);
  }

  .sam-empty {
    padding: var(--tl-spacing-xl) 0;
    text-align: center;
    color: var(--tl-color-neutral-400);
    font-size: var(--tl-font-size-sm);
  }

  .sam-message, .sam-log {
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
  }
  .sam-message-header, .sam-log-header {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    width: 100%;
    padding: var(--tl-spacing-sm) 0;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    font-size: var(--tl-font-size-sm);
  }
  .sam-message-role {
    padding: 2px var(--tl-spacing-xs);
    border-radius: var(--tl-border-radius-sm);
    font-size: 10px;
    font-weight: var(--tl-font-weight-semibold);
    text-transform: uppercase;
  }
  .sam-role-system { background: var(--tl-color-neutral-100); color: var(--tl-color-neutral-500); }
  .sam-role-user { background: #eff8ff; color: #2491eb; }
  .sam-role-assistant { background: #f3e8ff; color: #7c3aed; }
  .sam-role-tool { background: #fef3c7; color: #92400e; }
  .sam-message-tool {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-600);
    font-weight: var(--tl-font-weight-medium);
  }
  .sam-message-seq {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-400);
    margin-left: auto;
  }
  .sam-chevron {
    color: var(--tl-color-neutral-400);
    transition: transform 150ms;
    flex-shrink: 0;
  }
  .sam-chevron.rotated { transform: rotate(180deg); }

  .sam-message-body, .sam-log-body {
    padding: 0 0 var(--tl-spacing-sm);
  }
  .sam-pre {
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    word-break: break-word;
    background: var(--tl-color-neutral-50);
    padding: var(--tl-spacing-sm);
    border-radius: var(--tl-border-radius-md);
    margin: 0;
    line-height: 1.4;
    max-height: 400px;
    overflow-y: auto;
  }
  .sam-pre-code {
    font-size: 11px;
    color: var(--tl-color-neutral-600);
  }
  .sam-tool-args { margin-top: var(--tl-spacing-xs); }
  .sam-tool-label {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--tl-color-neutral-400);
    margin-bottom: 2px;
  }

  .sam-log-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .sam-log-dot-agent_started { background: #2491eb; }
  .sam-log-dot-prompt { background: var(--tl-color-neutral-400); }
  .sam-log-dot-output { background: #15803d; }
  .sam-log-dot-error { background: #dc2626; }
  .sam-log-dot-agent_completed { background: #15803d; }
  .sam-log-error .sam-log-header { color: #dc2626; }
  .sam-log-type {
    font-weight: var(--tl-font-weight-medium);
    font-size: var(--tl-font-size-sm);
  }
  .sam-log-time {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-400);
    margin-left: auto;
  }
  .sam-log-label {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-600);
    margin-bottom: var(--tl-spacing-xs);
  }

  .sam-run-history {
    display: flex;
    flex-direction: column;
  }
  .sam-run-history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--tl-spacing-sm) 0;
    border: none;
    border-bottom: var(--tl-border-width-thin) solid var(--tl-color-neutral-100);
    background: none;
    cursor: pointer;
    text-align: left;
  }
  .sam-run-history-item:hover { background: var(--tl-color-neutral-50); }
  .sam-run-history-main {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-sm);
  }
  .sam-run-history-meta {
    font-size: var(--tl-font-size-xs);
    color: var(--tl-color-neutral-500);
  }
  .sam-run-history-side {
    display: flex;
    align-items: center;
    gap: var(--tl-spacing-xs);
    color: var(--tl-color-neutral-300);
  }

  .sam-confirm-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 998;
  }
  .sam-confirm-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--tl-color-surface, #fff);
    border-radius: var(--tl-border-radius-lg);
    padding: var(--tl-spacing-lg);
    max-width: 400px;
    width: 90%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    z-index: 999;
  }
  .sam-confirm-dialog h4 {
    font-size: var(--tl-font-size-base);
    font-weight: var(--tl-font-weight-semibold);
    margin: 0 0 var(--tl-spacing-sm);
  }
  .sam-confirm-dialog p {
    font-size: var(--tl-font-size-sm);
    color: var(--tl-color-neutral-600);
    margin: 0 0 var(--tl-spacing-md);
    line-height: 1.4;
  }

  .breadcrumb-item {
    background: none;
    border: none;
    color: var(--tl-color-brand, #2491eb);
    font-size: var(--tl-font-size-sm);
    cursor: pointer;
    padding: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .sam-live-dot { animation: none; }
  }
</style>
