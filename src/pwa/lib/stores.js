import { writable, derived } from 'svelte/store';

export const online = writable(navigator.onLine);

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => online.set(true));
  window.addEventListener('offline', () => online.set(false));
}

export const isStandalone = writable(
  typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches,
);

if (typeof window !== 'undefined') {
  window
    .matchMedia('(display-mode: standalone)')
    .addEventListener('change', (e) => isStandalone.set(e.matches));
}

let _deferredPrompt = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _deferredPrompt = e;
  });
}

export function getDeferredPrompt() {
  return _deferredPrompt;
}

export async function triggerInstall() {
  if (!_deferredPrompt) return null;
  _deferredPrompt.prompt();
  const result = await _deferredPrompt.userChoice;
  _deferredPrompt = null;
  return result.outcome;
}
