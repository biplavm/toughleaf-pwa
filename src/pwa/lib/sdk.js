import { createClient, USER_ME_KEY, PROJECTS_LIST_KEY } from '@toughleaf/platform-sdk';

export { createClient, USER_ME_KEY, PROJECTS_LIST_KEY };

const backendUrl = import.meta.env.VITE_PUBLIC_TOUGHLEAF_BACKEND
  ?? import.meta.env.VITE_TL_API_BASE
  ?? '';

const baseUrl = backendUrl
  ? (backendUrl.startsWith('http') ? (backendUrl.endsWith('/api/v1') ? backendUrl : backendUrl + '/api/v1') : `https://${backendUrl}`.replace(/\/api\/v1.*$/, '/api/v1'))
  : '/api/v1';

export const client = createClient({ baseUrl });

const saved = localStorage.getItem('tl_session');
if (saved) {
  try {
    const { access_token } = JSON.parse(saved);
    client.setAccessToken(access_token);
    client.refresh().catch(() => {
      client.logout();
    });
  } catch {
    localStorage.removeItem('tl_session');
  }
}

client.session.subscribe((session) => {
  if (session?.access_token) {
    localStorage.setItem('tl_session', JSON.stringify({ access_token: session.access_token }));
  } else {
    localStorage.removeItem('tl_session');
  }
});

export function getUserResource() {
  let unsubscribe = () => {};
  const subscription = client.account.observeUser();
  return {
    subscribe(run) {
      const sub = subscription.subscribe((state) => {
        run(state.data ?? null);
      });
      unsubscribe = sub.unsubscribe;
      return unsubscribe;
    },
  };
}
