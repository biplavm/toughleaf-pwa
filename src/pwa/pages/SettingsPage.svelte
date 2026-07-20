<script>
  import { client } from '../lib/sdk.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonDetail from '../components/skeleton/SkeletonDetail.svelte';

  let loading = true;
  let error = '';
  let company = null;
  let companyPeople = [];
  let notifPrefs = null;
  let notifSaving = false;
  let notifSaved = '';

  async function loadSettings() {
    loading = true;
    error = '';
    try {
      [company, companyPeople, notifPrefs] = await Promise.all([
        client.account.getCompany().catch(() => null),
        client.account.listCompanyPeople().catch(() => []),
        client.account.getNotificationPreferences().catch(() => null),
      ]);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load settings';
    } finally {
      loading = false;
    }
  }

  async function saveNotifPrefs() {
    if (!notifPrefs) return;
    notifSaving = true;
    try {
      await client.account.updateNotificationPreferences(notifPrefs);
      notifSaved = 'Saved';
      setTimeout(() => (notifSaved = ''), 3000);
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to save preferences';
    } finally {
      notifSaving = false;
    }
  }

  function toggleNotif(key) {
    if (!notifPrefs) return;
    notifPrefs[key] = !notifPrefs[key];
    notifPrefs = notifPrefs;
  }

  loadSettings();
</script>

{#if loading}
  <div class="settings-card">
    <SkeletonDetail rows={4} sections={1} />
  </div>
  <div class="settings-card">
    <SkeletonDetail rows={3} sections={1} />
  </div>
{:else if error}
  <div class="empty-state"><p class="empty-state-title">{error}</p></div>
{:else}
  {#if notifSaved}
    <div class="inline-alert">{notifSaved}</div>
  {/if}

  {#if company}
    <div class="settings-card">
      <div class="settings-card-title">Company Information</div>
      <div class="settings-card-desc">Your organization details. Full editing available on desktop.</div>
      <div class="settings-row"><div class="settings-row-label">Company name</div><div class="settings-row-value">{company.company_name ?? '—'}</div></div>
      <div class="settings-row"><div class="settings-row-label">Company ID</div><div class="settings-row-value mono">{company.id}</div></div>
      <div class="settings-row"><div class="settings-row-label">Type</div><div class="settings-row-value">{company.company_type ?? '—'}</div></div>
    </div>
  {/if}

  {#if companyPeople.length > 0}
    <div class="settings-card">
      <div class="settings-card-title">Team Members <span class="count">({companyPeople.length})</span></div>
      <div class="settings-card-desc">People in your organization.</div>
      <div class="detail-panel" style="margin-top:var(--tl-spacing-md)">
        <table class="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {#each companyPeople as person}
              <tr>
                <td class="primary">{person.first_name ?? ''} {person.last_name ?? ''}</td>
                <td class="secondary">{person.email ?? '—'}</td>
                <td class="secondary">{person.roles?.map((r) => r.name ?? r).join(', ') ?? '—'}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="list-view">
          {#each companyPeople as person}
            <div class="list-item">
              <div class="list-item-main">
                <div class="list-item-title">{person.first_name ?? ''} {person.last_name ?? ''}</div>
                <div class="list-item-meta">
                  <span>{person.email ?? '—'}</span>
                  <span>{person.roles?.map((r) => r.name ?? r).join(', ') ?? '—'}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}

  {#if notifPrefs}
    <div class="settings-card">
      <div class="settings-card-title">Notification Preferences</div>
      <div class="settings-card-desc">Control which notifications you receive.</div>
      {#each Object.keys(notifPrefs) as key}
        <div class="settings-row">
          <div class="settings-row-label">{key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</div>
          <button class="toggle-switch" class:on={notifPrefs[key]} on:click={() => toggleNotif(key)} role="switch" aria-checked={notifPrefs[key]}>
            <span class="toggle-slider"></span>
          </button>
        </div>
      {/each}
      <div class="action-row">
        <button class="btn btn-primary btn-sm" on:click={saveNotifPrefs} disabled={notifSaving}>
          {notifSaving ? 'Saving…' : 'Save preferences'}
        </button>
      </div>
    </div>
  {/if}
{/if}
