'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { requestNotificationPermission, sendLocalNotification } from '@/lib/notifications';

// Play notification sound
function playNotificationSound() {
  try {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVggoKIeGBGPnuqy8+tfGNUXX6QjH1jR0N1pcjTtIVhTWl8kI+CY0k+cJ3M17B9XFNpf5KPg2hLPm6bydW0gF1Sa3yRkINpTD5tnsnXtYFdU2x8kZGEaUw+b53K2LaCXVRtfJKRhGlNPm+dyti2gV1UbXyTkYRpTT5wncrYtoJdVG58k5GEaU0+cJ3K2LaCXVRufJORhGlNPnCdyti2g11VbnyUkoRpTT5wncrYtoRdVW58lJKEaU0+cJ3K2LaFXVVufJSRhGlNPnCdyti2hV1WbnyUkoRpTT5wncrYtoZdV298lZKEaU0+cJ3K2LaGXVdvfJWT');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch {}
}

interface UseNotificationsOptions {
  enabled?: boolean;
  soundEnabled?: boolean;
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { enabled = true, soundEnabled = true } = options;
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const prevOrderCountRef = useRef(0);

  // Request permission on mount
  useEffect(() => {
    if (!enabled) return;
    requestNotificationPermission().then(setPermission);
  }, [enabled]);

  // Check for new orders and notify
  const checkNewOrders = useCallback(
    (orders: { id: string; order_number: number; customer_name: string; status: string }[]) => {
      if (!enabled) return;

      const currentCount = orders.length;
      const prevCount = prevOrderCountRef.current;

      // New order arrived
      if (currentCount > prevCount && prevCount > 0) {
        const newestOrder = orders[0]; // Orders are sorted newest first

        // Play sound
        if (soundEnabled) {
          playNotificationSound();
        }

        // Show browser notification
        if (permission === 'granted') {
          sendLocalNotification(`Nuevo Pedido #${newestOrder.order_number}`, {
            body: `${newestOrder.customer_name} — Verifica en cocina`,
            tag: `new-order-${newestOrder.id}`,
            requireInteraction: true,
          } as NotificationOptions);
        }
      }

      prevOrderCountRef.current = currentCount;
    },
    [enabled, soundEnabled, permission]
  );

  // Notify when order status changes
  const notifyStatusChange = useCallback(
    (orderNumber: number, newStatus: string, customerName: string) => {
      if (!enabled || permission !== 'granted') return;

      const messages: Record<string, string> = {
        preparing: `${customerName} esta cocinando tu pedido #${orderNumber}`,
        ready: `Pedido #${orderNumber} listo para entregar`,
        dispatched: `Pedido #${orderNumber} en camino`,
        delivered: `Pedido #${orderNumber} entregado`,
      };

      const msg = messages[newStatus];
      if (msg) {
        sendLocalNotification(msg, {
          tag: `status-${orderNumber}`,
        } as NotificationOptions);
      }
    },
    [enabled, permission]
  );

  return { permission, checkNewOrders, notifyStatusChange };
}
