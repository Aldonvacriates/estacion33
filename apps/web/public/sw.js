// Estación 33 service worker — phase 6.
//
// Handles Web Push notifications for repartidores. The page registers
// this SW from /repartidor (see InstallPrompt.tsx); the server uses
// web-push (lib/push.ts) to deliver offers when a new ready+delivery
// order needs a driver.

const VERSION = 'estacion33-v3';
const ICON_CACHE = `${VERSION}-icons`;

// URL prefixes whose responses we cache aggressively after the first
// fetch. These are dynamic ImageResponse routes — rendering a 1290×2796
// PNG at the edge takes a few hundred ms, so caching the result makes
// the second cold-start feel instant. They never change for a given URL
// (the burger SVG is hard-coded), so cache-first is safe.
const CACHEABLE_PREFIXES = [
  '/apple-splash',
  '/icon-192',
  '/icon-512',
  '/apple-icon',
  '/burger-favicon.svg',
  '/manifest.webmanifest',
];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Clear stale caches from older versions so we don't serve obsolete
  // icons after a brand refresh.
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (CACHEABLE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(cacheFirst(req));
  }
  // Everything else (HTML pages, API calls, Supabase fetches) goes
  // straight to the network — we never want to serve a stale menu price
  // or order status from the cache.
});

async function cacheFirst(request) {
  const cache = await caches.open(ICON_CACHE);
  const hit = await cache.match(request);
  if (hit) {
    // Refresh in the background so we eventually pick up brand updates.
    fetch(request)
      .then((res) => {
        if (res && res.status === 200) cache.put(request, res.clone());
      })
      .catch(() => {});
    return hit;
  }
  try {
    const res = await fetch(request);
    if (res && res.status === 200) cache.put(request, res.clone());
    return res;
  } catch (err) {
    // Network down + nothing in cache → propagate the failure so the
    // browser shows its normal offline UI.
    throw err;
  }
}

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
