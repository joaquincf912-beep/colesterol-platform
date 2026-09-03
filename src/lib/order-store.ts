// Shared in-memory order store for demo mode
// Works on Vercel Edge Runtime with warm instances

import type { Order, OrderStatus } from '@/types';

// In-memory store (persists while the edge function is warm)
let ordersStore: Order[] = [];

export function getOrders(): Order[] {
  return ordersStore;
}

export function addOrder(order: Order): Order {
  ordersStore = [order, ...ordersStore];
  return order;
}

export function updateOrder(orderId: string, updates: Partial<Order>): Order | null {
  const idx = ordersStore.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;
  ordersStore[idx] = { ...ordersStore[idx], ...updates, updated_at: new Date().toISOString() };
  return ordersStore[idx];
}

export function updateOrderStatus(orderId: string, status: OrderStatus, extra?: Partial<Order>): Order | null {
  const now = new Date().toISOString();
  const updates: Partial<Order> = { status, updated_at: now, ...extra };
  if (status === 'preparing') updates.kitchen_started_at = now;
  if (status === 'ready') updates.kitchen_ready_at = now;
  if (status === 'dispatched') updates.dispatched_at = now;
  if (status === 'delivered') updates.delivered_at = now;
  if (status === 'cancelled') updates.cancelled_at = now;
  return updateOrder(orderId, updates);
}

export function getOrderById(id: string): Order | undefined {
  return ordersStore.find((o) => o.id === id);
}

export function getOrderByNumber(num: number): Order | undefined {
  return ordersStore.find((o) => o.order_number === num);
}

export function getNextOrderNumber(): number {
  if (ordersStore.length === 0) return 1001;
  return Math.max(...ordersStore.map((o) => o.order_number)) + 1;
}
