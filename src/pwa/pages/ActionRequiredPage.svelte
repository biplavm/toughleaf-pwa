<script>
  import { client } from '../lib/sdk.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonDetail from '../components/skeleton/SkeletonDetail.svelte';
  import { navigate } from '../lib/router.js';

  let loading = true;
  let error = '';
  let features = null;
  let workflows = [];
  let user = null;
  let actionItems = [];

  async function loadActionRequired() {
    loading = true;
    error = '';
    actionItems = [];
    try {
      const [f, u, wf] = await Promise.all([
        client.env.getFeatures().catch(() => null),
        client.account.getUser().catch(() => null),
        client.workflows.list().catch(() => []),
      ]);
      features = f;
      user = u;
      workflows = wf;

      if (user) {
        if (user.status === 0 || user.status === 'pending') {
          actionItems.push({
            type: 'verification',
            label: 'Email verification required',
            desc: 'Please verify your email address to activate your account.',
            action: 'Verify email',
            route: '/profile',
          });
        }
      }

      if (features?.allow?.length) {
        const denied = features.deny ?? [];
        if (denied.includes('product:clearspend')) {
          actionItems.push({
            type: 'feature',
            label: 'ClearSpend access pending',
            desc: 'ClearSpend is not yet enabled for your account.',
            action: null,
            route: null,
          });
        }
        if (denied.includes('product:certcheck')) {
          actionItems.push({
            type: 'feature',
            label: 'CertCheck access pending',
            desc: 'CertCheck is not yet enabled for your account.',
            action: null,
            route: null,
          });
        }
      }

      const projects = await client.projects.list(undefined, { staleTime: 30_000 }).catch(() => []);
      for (const proj of projects.slice(0, 10)) {
        try {
          const surveys = await client.projects.listSurveys(proj.id, undefined, { staleTime: 60_000 });
          for (const s of surveys) {
            if (s.invitation_status === "invited" || s.workflow_step_id || s.workflow_prompt?.action_required) {
              actionItems.push({
                type: 'outreach',
                label: `${s.participant?.company_name ?? 'Firm'} needs a response`,
                desc: `Project: ${proj.name ?? '—'} — Step: ${s.workflow_step?.label ?? '—'}`,
                action: 'View in Outreach',
                route: '/outreach',
              });
            }
          }
        } catch {}
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load';
    } finally {
      loading = false;
    }
  }

  loadActionRequired();
</script>



{#if loading}
  <div class="settings-card">
    <SkeletonDetail rows={3} sections={1} />
  </div>
  <div class="settings-card">
    <SkeletonDetail rows={3} sections={1} />
  </div>
{:else if error}
  <div class="empty-state"><p class="empty-state-title">{error}</p></div>
{:else if actionItems.length === 0}
  <div class="empty-state">
    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
    <p class="empty-state-title">No actions required</p>
    <p class="empty-state-desc">You're all caught up. Nothing needs your attention right now.</p>
  </div>
{:else}
  {#each actionItems as item}
    <div class="settings-card">
      <div style="display:flex;align-items:flex-start;justify-content:space-between">
        <div style="flex:1;min-width:0">
          <div style="font-size:var(--tl-font-size-md);font-weight:var(--tl-font-weight-semibold);color:var(--tl-color-text-on-background);margin-bottom:var(--tl-spacing-xs)">
            {item.label}
          </div>
          <div style="font-size:var(--tl-font-size-sm);color:var(--tl-color-text-on-surface)">
            {item.desc}
          </div>
        </div>
        <span class="badge badge-{item.type === 'verification' ? 'warning' : item.type === 'outreach' ? 'accent' : ''}">
          {item.type}
        </span>
      </div>
      {#if item.action && item.route}
        <div class="action-row">
          <button class="btn btn-primary btn-sm" on:click={() => navigate(item.route)}>{item.action}</button>
        </div>
      {/if}
    </div>
  {/each}
{/if}
