let listeners = [];
let current = (window.location.hash.slice(1) || '/dashboard').split('?')[0];

window.addEventListener('hashchange', () => {
  current = (window.location.hash.slice(1) || '/dashboard').split('?')[0];
  listeners.forEach((fn) => fn(current));
});

export function navigate(hash) {
  window.location.hash = hash;
}

export function routeStore() {
  return {
    subscribe(run) {
      run(current);
      listeners.push(run);
      return () => {
        listeners = listeners.filter((l) => l !== run);
      };
    },
  };
}

export function getCurrentRoute() {
  return current;
}
