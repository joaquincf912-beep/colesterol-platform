import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, OrderStatus } from '@/types';
import { DEMO_ORDERS } from '@/lib/demo-orders';

// BroadcastChannel for cross-tab real-time sync
const channel = typeof window !== 'undefined'
  ? new BroadcastChannel('colesterol-orders')
  : null;

interface OrderStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, extra?: Partial<Order>) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  removeOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: number) => Order | undefined;
  getNextOrderNumber: () => number;
  getActiveOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: DEMO_ORDERS,

      addOrder: (order: Order) => {
        set((state) => ({
          orders: [order, ...state.orders],
        }));
        // Broadcast to all tabs
        channel?.postMessage({ type: 'ADD_ORDER', order });
      },

      updateOrderStatus: (orderId: string, status: OrderStatus, extra?: Partial<Order>) => {
        const now = new Date().toISOString();
        const updates: Partial<Order> = { status, updated_at: now, ...extra };

        // Add timestamp based on status
        if (status === 'preparing') updates.kitchen_started_at = now;
        if (status === 'ready') updates.kitchen_ready_at = now;
        if (status === 'dispatched') updates.dispatched_at = now;
        if (status === 'delivered') updates.delivered_at = now;
        if (status === 'cancelled') updates.cancelled_at = now;

        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, ...updates } : o
          ),
        }));
        // Broadcast to all tabs
        channel?.postMessage({ type: 'UPDATE_ORDER', orderId, updates });
      },

      updateOrder: (orderId: string, updates: Partial<Order>) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, ...updates, updated_at: new Date().toISOString() } : o
          ),
        }));
        channel?.postMessage({ type: 'UPDATE_ORDER', orderId, updates });
      },

      removeOrder: (orderId: string) => {
        set((state) => ({
          orders: state.orders.filter((o) => o.id !== orderId),
        }));
        channel?.postMessage({ type: 'REMOVE_ORDER', orderId });
      },

      getOrderById: (orderId: string) => {
        return get().orders.find((o) => o.id === orderId);
      },

      getOrderByNumber: (orderNumber: number) => {
        return get().orders.find((o) => o.order_number === orderNumber);
      },

      getNextOrderNumber: () => {
        const orders = get().orders;
        if (orders.length === 0) return 1001;
        return Math.max(...orders.map((o) => o.order_number)) + 1;
      },

      getActiveOrders: () => {
        return get().orders.filter(
          (o) => o.status !== 'delivered' && o.status !== 'cancelled'
        );
      },

      getOrdersByStatus: (status: OrderStatus) => {
        return get().orders.filter((o) => o.status === status);
      },
    }),
    {
      name: 'colesterol-orders',
    }
  )
);

// Listen for updates from other tabs
if (typeof window !== 'undefined') {
  channel?.addEventListener('message', (event) => {
    const { type, orderId, order, updates } = event.data;

    if (type === 'ADD_ORDER' && order) {
      useOrderStore.setState((state) => {
        // Avoid duplicates
        if (state.orders.some((o) => o.id === order.id)) return state;
        return { orders: [order, ...state.orders] };
      });
    }

    if (type === 'UPDATE_ORDER' && orderId && updates) {
      useOrderStore.setState((state) => ({
        orders: state.orders.map((o) =>
          o.id === orderId ? { ...o, ...updates } : o
        ),
      }));
    }

    if (type === 'REMOVE_ORDER' && orderId) {
      useOrderStore.setState((state) => ({
        orders: state.orders.filter((o) => o.id !== orderId),
      }));
    }
  });
}
