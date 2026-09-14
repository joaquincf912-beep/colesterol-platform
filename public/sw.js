// TraccionWeb Service Worker — cache-first para estáticos, network para lo demás
const CACHE = 'tw-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // Cache-first para assets con hash (nunca cambian)
  if (url.pathname.startsWith('/_next/static/') || /\.(jpg|jpeg|png|webp|avif|svg|woff2|mp4)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  // Network-first para HTML/API (siempre fresco, cache como fallback offline)
  if (request.mode === 'navigate' || url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (request.mode === 'navigate' && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
  }
});

// Push notification
self.addEventListener('push', (event) => {
  const data = event.data?.json() || { title: 'TraccionWeb', body: 'Nuevo pedido' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200],
      tag: data.tag || 'order',
      renotify: true,
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'Ver pedido' },
        { action: 'dismiss', title: 'Cerrar' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/pedidos') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/pedidos');
    })
  );
});
