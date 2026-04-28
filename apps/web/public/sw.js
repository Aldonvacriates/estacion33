// Estación 33 service worker — phase 5b.
//
// Right now this file only exists to satisfy Chrome's "installable PWA"
// criteria, which require at minimum a registered SW with a fetch
// handler. We deliberately keep the fetch handler as a passthrough; we
// don't cache anything because the menu/orders flows are dynamic and
// stale data would cause real problems (wrong prices, missed orders).
//
// Phase 6 (push notifications) will replace this with a real handler:
//   self.addEventListener('push', (event) => { ... });
//   self.addEventListener('notificationclick', (event) => { ... });

const VERSION = 'estacion33-v1';

self.addEventListener('install', (event) => {
  // Activate immediately, even if there's a previous version.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Claim already-open clients so the SW takes effect on first install
  // without requiring a reload.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Passthrough — let the network handle every request. We're not caching
  // anything in v1. This handler exists purely so Chrome marks the page
  // as "installable" (PWA criteria explicitly require a fetch listener).
  // The empty handler costs us nothing at runtime.
});

// Phase 6 will add push + notificationclick handlers here.
