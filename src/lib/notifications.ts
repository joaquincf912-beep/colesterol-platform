'use client';

/**
 * Push Notification Manager for TraccionWeb App
 *
 * Handles browser push notifications for order status updates.
 * Falls back to in-app notifications if push isn't supported.
 */

// Check if push notifications are supported
export function isPushSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

// Request permission for push notifications
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) return 'denied';

  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';

  const permission = await Notification.requestPermission();
  return permission;
}

// Send a local notification (no server needed)
export function sendLocalNotification(title: string, options?: NotificationOptions): void {
  if (!isPushSupported()) return;
  if (Notification.permission !== 'granted') return;

  try {
    // eslint-disable-next-line no-restricted-globals
    new Notification(title, {
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      ...options,
    } as NotificationOptions);
  } catch {
    // Service worker notification fallback
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          ...options,
        } as NotificationOptions);
      });
    }
  }
}

// Order status notification messages
const STATUS_MESSAGES: Record<string, { title: string; body: string }> = {
  received: {
    title: 'Pedido Recibido',
    body: 'Tu pedido fue recibido y esta en cola.',
  },
  preparing: {
    title: 'Cocinando',
    body: 'Tu pedido se esta preparando ahora mismo.',
  },
  ready: {
    title: 'Pedido Listo',
    body: 'Tu pedido esta listo para recoger o enviar.',
  },
  dispatched: {
    title: 'Despachado',
    body: 'Un repartidor esta recogiendo tu pedido.',
  },
  on_the_way: {
    title: 'En Camino',
    body: 'Tu pedido va en camino. Llega pronto.',
  },
  delivered: {
    title: 'Entregado',
    body: 'Tu pedido fue entregado. ¡Buen provecho!',
  },
  cancelled: {
    title: 'Pedido Cancelado',
    body: 'Tu pedido fue cancelado.',
  },
};

// Send order status notification
export function notifyOrderStatus(status: string, orderNumber: number): void {
  const msg = STATUS_MESSAGES[status];
  if (!msg) return;

  sendLocalNotification(`${msg.title} — #${orderNumber}`, {
    body: msg.body,
    tag: `order-${orderNumber}`,
  } as NotificationOptions);
}

// Subscribe to order status changes and send notifications
export function createOrderNotificationHandler(
  orderNumber: number,
  callback?: (status: string) => void
): (status: string) => void {
  // Request permission on first subscribe
  requestNotificationPermission();

  let lastStatus = '';

  return (status: string) => {
    if (status !== lastStatus) {
      lastStatus = status;
      notifyOrderStatus(status, orderNumber);
      callback?.(status);
    }
  };
}
