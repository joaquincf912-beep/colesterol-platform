// TraccionWeb Service Worker
// Handles push notifications and caching

const CACHE_NAME = 'traccionweb-v1';
const STATIC_ASSETS = ['/', '/pedidos', '/delivery', '/admin'];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
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

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing window or open new one
      for (const client of clientList) {
        if (client.url.includes('/pedidos') && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/pedidos');
    })
  );
});
