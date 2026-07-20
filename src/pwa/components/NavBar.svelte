<script>
  import { navigate } from '../lib/router.js';

  export let route;
  export let sidebarOpen = false;
  export let userInfo = null;

  const navSections = [
    {
      label: 'Overview',
      items: [
        { id: '/dashboard', label: 'Dashboard', icon: 'home' },
        { id: '/outreach',  label: 'Outreach Hub', icon: 'send' },
        { id: '/actions',   label: 'Action Required', icon: 'alert' },
      ],
    },
    {
      label: 'Workspace',
      items: [
        { id: '/projects', label: 'Projects', icon: 'folder' },
        { id: '/lookup',   label: 'Firm Lookup', icon: 'search' },
        { id: '/invites',  label: 'Team Invites', icon: 'mail' },
      ],
    },
    {
      label: 'Reporting',
      items: [
        { id: '/reports',  label: 'Reports', icon: 'chart' },
      ],
    },
    {
      label: 'Account',
      items: [
        { id: '/profile',  label: 'Profile', icon: 'user' },
        { id: '/settings', label: 'Settings', icon: 'settings' },
      ],
    },
  ];

  function initials(name) {
    if (!name) return '?';
    const parts = name.split(' ').filter(Boolean);
    return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
  }

  function fullName(u) {
    if (!u) return '';
    return (`${u.first_name ?? ''} ${u.last_name ?? ''}`.trim() || u.email) ?? '';
  }
</script>

<aside class="sidebar" class:open={sidebarOpen}>
  <div class="sidebar-header">
    <img src="/images/logo-tl-dark.svg" alt="Tough Leaf Companion App" class="sidebar-logo" />
    <span class="sidebar-tag">Companion App</span>
  </div>

  {#each navSections as section}
    <nav class="nav-section">
      <div class="nav-section-label">{section.label}</div>
      {#each section.items as item}
        <button class="nav-item" class:active={route === item.id} on:click={() => navigate(item.id)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            {#if item.icon === 'home'}
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            {:else if item.icon === 'send'}
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            {:else if item.icon === 'alert'}
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            {:else if item.icon === 'folder'}
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            {:else if item.icon === 'search'}
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            {:else if item.icon === 'mail'}
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            {:else if item.icon === 'user'}
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            {:else if item.icon === 'settings'}
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            {:else if item.icon === 'chart'}
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            {/if}
          </svg>
          {item.label}
        </button>
      {/each}
    </nav>
  {/each}

  <div class="sidebar-footer">
    <div class="sidebar-user" on:click={() => navigate('/profile')} role="button" tabindex="0"
         on:keydown={(e) => e.key === 'Enter' && navigate('/profile')}>
      <div class="avatar">{initials(fullName(userInfo))}</div>
      <div class="user-info">
        <span class="user-name">{fullName(userInfo) || 'Loading…'}</span>
        <span class="user-email">{userInfo?.email ?? ''}</span>
      </div>
    </div>
  </div>
</aside>

<style>
  .sidebar-header { flex-direction: column; align-items: flex-start; gap: var(--tl-spacing-xs); }
  .sidebar-logo { height: 28px; width: auto; }
  .sidebar-tag {
    padding: 2px var(--tl-spacing-xs);
    border-radius: var(--tl-border-radius-sm);
    background: var(--tl-color-neutral-100);
    color: var(--tl-color-neutral-500);
    font-size: var(--tl-font-size-xs);
    font-weight: var(--tl-font-weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
    white-space: nowrap;
  }
</style>
