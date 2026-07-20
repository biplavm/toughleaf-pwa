<script>
  export let onLogin = null;
  export let error = '';

  let email = '';
  let password = '';
  let loading = false;

  function submit() {
    loading = true;
    Promise.resolve(onLogin?.(email, password)).finally(() => (loading = false));
  }
</script>

<div class="login-screen">
  <div class="login-container">
    <div class="login-brand">
      <img src="/images/logo-tl-dark.svg" alt="Tough Leaf Companion App" class="login-logo" />
      <span class="login-tag">Companion App</span>
    </div>

    <h1 class="login-heading">Sign in</h1>
    <p class="login-subheading">Enter your credentials to access your workspace.</p>

    {#if error}
      <div class="form-error">{error}</div>
    {/if}

    <form on:submit|preventDefault={submit}>
      <div class="form-field">
        <label for="email">Email</label>
        <input id="email" type="email" bind:value={email} required autocomplete="username" placeholder="you@toughleaf.com" />
      </div>

      <div class="form-field">
        <label for="password">Password</label>
        <input id="password" type="password" bind:value={password} required autocomplete="current-password" />
      </div>

      <button type="submit" class="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Signing in…' : 'Continue'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-logo {
    height: 32px;
    width: auto;
  }
  .login-tag {
    display: inline-block;
    margin-top: var(--tl-spacing-sm);
    padding: 2px var(--tl-spacing-xs);
    border-radius: var(--tl-border-radius-sm);
    background: var(--tl-color-neutral-100);
    color: var(--tl-color-neutral-500);
    font-size: var(--tl-font-size-xs);
    font-weight: var(--tl-font-weight-semibold);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
</style>
