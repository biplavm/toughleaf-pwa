<script>
  import { client } from './lib/sdk.js';
  import { routeStore, navigate } from './lib/router.js';
  import { online, isStandalone, getDeferredPrompt, triggerInstall } from './lib/stores.js';
  import NavBar from './components/NavBar.svelte';
  import InstallBanner from './components/InstallBanner.svelte';
  import LoginView from './components/LoginView.svelte';
  import EnrichNotifications from './components/EnrichNotifications.svelte';
  import DashboardPage from './pages/DashboardPage.svelte';
  import OutreachPage from './pages/OutreachPage.svelte';
  import ActionRequiredPage from './pages/ActionRequiredPage.svelte';
  import ProjectsPage from './pages/ProjectsPage.svelte';
  import LookupPage from './pages/LookupPage.svelte';
  import InvitesPage from './pages/InvitesPage.svelte';
  import ProfilePage from './pages/ProfilePage.svelte';
  import SettingsPage from './pages/SettingsPage.svelte';
  import ReportsPage from './pages/ReportsPage.svelte';
  import NotificationsPage from './pages/NotificationsPage.svelte';

  let route;
  let session = null;
  let error = '';
  let showInstall = false;
  let sidebarOpen = false;
  let userInfo = null;

  const routeUnsub = routeStore().subscribe((v) => { route = v; sidebarOpen = false; });
  isStandalone.subscribe((v) => (showInstall = !v && !!getDeferredPrompt()));

  client.session.subscribe((s) => {
    session = s;
    if (s) {
      client.account.getUser().then((u) => (userInfo = u)).catch(() => {});
    } else {
      userInfo = null;
    }
  });

  function handleLogin(email, password) {
    error = '';
    return client.login({ email, password }).catch((e) => {
      error = e instanceof Error ? e.message : 'Login failed';
    });
  }

  function handleInstall() {
    triggerInstall();
    showInstall = false;
  }

  function toggleSidebar() { sidebarOpen = !sidebarOpen; }
  function closeSidebar() { sidebarOpen = false; }

  function pageTitle(r) {
    const titles = {
      '/dashboard': 'Dashboard',
      '/outreach': 'Outreach Hub',
      '/actions': 'Action Required',
      '/projects': 'Projects',
      '/lookup': 'Firm Lookup',
      '/invites': 'Team Invites',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/reports': 'Reports',
      '/notifications': 'Notifications',
    };
    return titles[r] ?? 'Dashboard';
  }
</script>

{#if !session}
  <LoginView onLogin={handleLogin} {error} />
{:else}
  <div class="sidebar-overlay" class:show={sidebarOpen} on:click={closeSidebar} on:keydown={(e) => e.key === 'Escape' && closeSidebar()} role="button" tabindex="-1" aria-label="Close navigation"></div>

  <div class="app-shell">
    <NavBar {route} {sidebarOpen} {userInfo} on:close={closeSidebar} />

    <div class="main-area">
      <header class="topbar">
        <div style="display:flex;align-items:center;gap:var(--tl-spacing-xs)">
          <button class="mobile-nav-toggle" on:click={toggleSidebar} aria-label="Toggle navigation">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span class="topbar-title">{pageTitle(route)}</span>
        </div>
        <div class="topbar-actions">
          {#if !$online}
            <span class="offline-pill">Offline</span>
          {/if}
          <EnrichNotifications />
        </div>
      </header>

      <div class="content-scroll">
        <div class="content">
          {#if route === '/dashboard'}
            <DashboardPage />
          {:else if route === '/outreach'}
            <OutreachPage />
          {:else if route === '/actions'}
            <ActionRequiredPage />
          {:else if route === '/projects'}
            <ProjectsPage />
          {:else if route === '/lookup'}
            <LookupPage />
          {:else if route === '/invites'}
            <InvitesPage />
          {:else if route === '/profile'}
            <ProfilePage />
          {:else if route === '/settings'}
            <SettingsPage />
          {:else if route === '/reports'}
            <ReportsPage />
          {:else if route === '/notifications'}
            <NotificationsPage />
          {:else}
            <DashboardPage />
          {/if}
        </div>
      </div>
    </div>
  </div>

  <InstallBanner show={showInstall} onInstall={handleInstall} onDismiss={() => (showInstall = false)} />
{/if}
