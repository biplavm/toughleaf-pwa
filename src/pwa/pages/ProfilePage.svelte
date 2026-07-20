<script>
  import { client } from '../lib/sdk.js';
  import LogoLoader from '../components/LogoLoader.svelte';
  import SkeletonDetail from '../components/skeleton/SkeletonDetail.svelte';

  let user = null;
  let company = null;
  let loading = true;
  let error = '';
  let editMode = false;
  let firstName = '';
  let lastName = '';
  let saving = false;
  let saveError = '';
  let saveSuccess = '';

  async function loadProfile() {
    loading = true;
    error = '';
    try {
      [user, company] = await Promise.all([
        client.account.getUser(),
        client.account.getCompany().catch(() => null),
      ]);
      firstName = user.first_name ?? '';
      lastName = user.last_name ?? '';
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load profile';
    } finally {
      loading = false;
    }
  }

  async function saveProfile() {
    saving = true;
    saveError = '';
    saveSuccess = '';
    try {
      await client.account.updateUser({ first_name: firstName, last_name: lastName });
      user = await client.account.getUser({ staleTime: 0 });
      saveSuccess = 'Saved';
      editMode = false;
      setTimeout(() => (saveSuccess = ''), 3000);
    } catch (e) {
      saveError = e instanceof Error ? e.message : 'Update failed';
    } finally {
      saving = false;
    }
  }

  loadProfile();
</script>

{#if loading}
  <div class="settings-card">
    <SkeletonDetail rows={4} sections={1} />
  </div>
{:else if error}
  <div class="empty-state"><p class="empty-state-title">{error}</p></div>
{:else if user}
  {#if saveSuccess}
    <div class="inline-alert">{saveSuccess}</div>
  {/if}

  <div class="settings-card">
    <div class="settings-card-title">Account</div>
    <div class="settings-card-desc">Your personal information and credentials.</div>

    {#if editMode}
      {#if saveError}<div class="form-error">{saveError}</div>{/if}
      <div class="settings-row"><div class="settings-row-label">First name</div><input class="settings-input" bind:value={firstName} /></div>
      <div class="settings-row"><div class="settings-row-label">Last name</div><input class="settings-input" bind:value={lastName} /></div>
      <div class="action-row">
        <button class="btn btn-primary btn-sm" on:click={saveProfile} disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button>
        <button class="btn btn-secondary btn-sm" on:click={() => (editMode = false)}>Cancel</button>
      </div>
    {:else}
      <div class="settings-row"><div class="settings-row-label">Name</div><div class="settings-row-value">{user.first_name ?? ''} {user.last_name ?? ''}</div></div>
      <div class="settings-row"><div class="settings-row-label">Email</div><div class="settings-row-value">{user.email}</div></div>
      <div class="action-row">
        <button class="btn btn-secondary btn-sm" on:click={() => (editMode = true)}>Edit profile</button>
      </div>
    {/if}
  </div>

  {#if company}
    <div class="settings-card">
      <div class="settings-card-title">Company</div>
      <div class="settings-card-desc">Your organization details. Full editing available on desktop.</div>
      <div class="settings-row"><div class="settings-row-label">Company name</div><div class="settings-row-value">{company.company_name ?? '—'}</div></div>
      <div class="settings-row"><div class="settings-row-label">Company ID</div><div class="settings-row-value mono">{company.id}</div></div>
    </div>
  {/if}

  <div class="settings-card">
    <div class="settings-card-title">Session</div>
    <div class="settings-card-desc">Sign out of your account on this device.</div>
    <button class="btn btn-danger btn-sm" on:click={() => client.logout()}>Sign out</button>
  </div>
{/if}
