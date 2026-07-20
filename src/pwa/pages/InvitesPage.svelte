<script>
  import { client } from '../lib/sdk.js';
  import SkeletonTable from '../components/skeleton/SkeletonTable.svelte';
  import SkeletonList from '../components/skeleton/SkeletonList.svelte';

  let invites = [];
  let loading = true;
  let error = '';
  let showCreate = false;
  let creating = false;
  let actionLoading = {};
  let inviteSearch = '';

  let newEmail = '';
  let newFirstName = '';
  let newLastName = '';
  let newRoleId = '';

  async function loadInvites() {
    loading = true;
    error = '';
    try {
      invites = await client.invites.list();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load invites';
    } finally {
      loading = false;
    }
  }

  async function createInvite() {
    if (!newEmail || !newFirstName || !newLastName || !newRoleId) return;
    creating = true;
    error = '';
    try {
      await client.invites.create({
        email: newEmail,
        first_name: newFirstName,
        last_name: newLastName,
        role_id: Number(newRoleId),
      });
      showCreate = false;
      newEmail = ''; newFirstName = ''; newLastName = ''; newRoleId = '';
      await loadInvites();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to create invite';
    } finally {
      creating = false;
    }
  }

  async function resendInvite(id) {
    actionLoading[id] = true;
    try {
      await client.invites.resend(id);
      await loadInvites();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to resend';
    } finally {
      actionLoading[id] = false;
    }
  }

  async function deleteInvite(id) {
    actionLoading[id] = true;
    try {
      await client.invites.delete(id);
      await loadInvites();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to delete';
    } finally {
      actionLoading[id] = false;
    }
  }

  $: filteredInvites = inviteSearch
    ? invites.filter((i) => {
        const q = inviteSearch.toLowerCase();
        return (i.email ?? '').toLowerCase().includes(q)
          || (i.first_name ?? '').toLowerCase().includes(q)
          || (i.last_name ?? '').toLowerCase().includes(q);
      })
    : invites;

  loadInvites();
</script>

<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--tl-spacing-md);gap:var(--tl-spacing-sm)">
  <div class="search-input" style="flex:1">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    <input type="text" bind:value={inviteSearch} placeholder="Search invites by name or email" />
  </div>
  <button class="btn btn-primary btn-sm" on:click={() => (showCreate = !showCreate)}>
    {showCreate ? 'Cancel' : 'New invite'}
  </button>
</div>

{#if error}<div class="form-error">{error}</div>{/if}

{#if showCreate}
  <div class="settings-card">
    <div class="settings-card-title">New invitation</div>
    <div class="settings-card-desc">Send an invite to a new team member.</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--tl-spacing-md)">
      <div class="form-field"><label for="inv-first">First name</label><input id="inv-first" bind:value={newFirstName} placeholder="Jane" /></div>
      <div class="form-field"><label for="inv-last">Last name</label><input id="inv-last" bind:value={newLastName} placeholder="Smith" /></div>
    </div>
    <div class="form-field"><label for="inv-email">Email</label><input id="inv-email" type="email" bind:value={newEmail} placeholder="jane@example.com" /></div>
    <div class="form-field"><label for="inv-role">Role ID</label><input id="inv-role" type="number" bind:value={newRoleId} placeholder="e.g. 3" /></div>
    <button class="btn btn-primary btn-sm" on:click={createInvite} disabled={creating || !newEmail || !newFirstName || !newLastName || !newRoleId}>
      {creating ? 'Sending…' : 'Send invite'}
    </button>
  </div>
{/if}

{#if loading}
  <div class="detail-panel">
    <SkeletonTable rows={5} columns={4} />
  </div>
  <div class="list-view">
    <SkeletonList items={5} lines={2} />
  </div>
{:else if filteredInvites.length === 0 && !inviteSearch}
  <div class="empty-state">
    <svg class="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
    <p class="empty-state-title">No pending invites</p>
    <p class="empty-state-desc">Team invitations will appear here.</p>
  </div>
{:else if filteredInvites.length === 0 && inviteSearch}
  <div class="empty-state">
    <p class="empty-state-title">No invites match "{inviteSearch}"</p>
  </div>
{:else}
  <div class="detail-panel">
    <table class="data-table">
      <thead>
        <tr><th>Name</th><th>Email</th><th>Status</th><th style="text-align:right">Actions</th></tr>
      </thead>
      <tbody>
        {#each filteredInvites as invite}
          <tr>
            <td class="primary">{invite.first_name ?? ''} {invite.last_name ?? ''}</td>
            <td class="secondary">{invite.email ?? '—'}</td>
            <td>
              {#if invite.status}
                <span class="badge badge-{invite.status === 'pending' ? 'warning' : 'success'}">{invite.status}</span>
              {:else}
                <span class="badge">—</span>
              {/if}
            </td>
            <td style="text-align:right;white-space:nowrap">
              <button class="btn btn-ghost btn-sm" on:click={() => resendInvite(invite.id)} disabled={actionLoading[invite.id]}>
                {actionLoading[invite.id] ? '…' : 'Resend'}
              </button>
              <button class="btn btn-ghost btn-sm" on:click={() => deleteInvite(invite.id)} disabled={actionLoading[invite.id]} style="color:var(--tl-color-error)">
                {actionLoading[invite.id] ? '…' : 'Delete'}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <div class="list-view">
      {#each filteredInvites as invite}
        <div class="list-item">
          <div class="list-item-main">
            <div class="list-item-title">{invite.first_name ?? ''} {invite.last_name ?? ''}</div>
            <div class="list-item-meta">
              <span>{invite.email ?? '—'}</span>
              {#if invite.status}<span>{invite.status}</span>{/if}
            </div>
          </div>
          <div style="display:flex;gap:var(--tl-spacing-xs)">
            <button class="btn btn-ghost btn-sm" on:click={() => resendInvite(invite.id)} disabled={actionLoading[invite.id]}>
              {actionLoading[invite.id] ? '…' : 'Resend'}
            </button>
            <button class="btn btn-ghost btn-sm" on:click={() => deleteInvite(invite.id)} disabled={actionLoading[invite.id]} style="color:var(--tl-color-error)">
              {actionLoading[invite.id] ? '…' : 'Delete'}
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
