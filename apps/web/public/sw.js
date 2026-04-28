// Estación 33 service worker — phase 6.
//
// Handles Web Push notifications for repartidores. The page registers
// this SW from /repartidor (see InstallPrompt.tsx); the server uses
// web-push (lib/push.ts) to deliver offers when a new ready+delivery
// order needs a driver.

const VERSION = 'estacion33-v2';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // Passthrough — required for PWA install criteria, but we don't cache.
});

// ---------------------------------------------------------------------------
// Push notification handler
// ---------------------------------------------------------------------------
// Server sends JSON with this shape:
//   { title: string, body: string, url: string, tag?: string }
// We surface it as a system notification with the burger icon.
self.addEventListener('push', (event) => {
  const data = (() => {
    try {
      return event.data ? event.data.json() : {};
    } catch {
      return {};
    }
  })();

  const title = data.title || 'Estación 33';
  const body = data.body || 'Pedido nuevo en la cola.';
  const url = data.url || '/repartidor';
  const tag = data.tag || 'estacion33-offer';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      // Replace any previous notification with the same tag — avoids
      // stacking multiple "new order" pings on top of each other.
      renotify: true,
      requireInteraction: false,
      vibrate: [200, 100, 200],
      icon: '/icon-192',
      badge: '/icon-192',
      data: { url },
    }),
  );
});

// ---------------------------------------------------------------------------
// Notification click — focus existing tab if open, else open the URL.
// ---------------------------------------------------------------------------
self.addEventListener('notificationclick', (event) => {
  const targetUrl = event.notification.data?.url || '/repartidor';
  event.notification.close();

  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      for (const client of all) {
        const sameOrigin = new URL(client.url).origin === self.location.origin;
        if (sameOrigin) {
          await client.focus();
          if ('navigate' in client) {
            try {
              await client.navigate(targetUrl);
            } catch {
              // Some browsers throw on cross-document navigate; fall through.
            }
          }
          return;
        }
      }
      await self.clients.openWindow(targetUrl);
    })(),
  );
});
