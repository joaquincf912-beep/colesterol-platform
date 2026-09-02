'use client';

import { useEffect, useCallback, useRef } from 'react';
import { getSupabaseClient } from './client';
import type { Order, Product } from '@/types';

type RealtimeCallback<T> = (payload: { eventType: string; new: T; old: T | null }) => void;

/**
 * Subscribe to real-time order changes.
 * Used by KDS and Delivery to receive orders instantly — no page refresh.
 */
export function useRealtimeOrders(callback: RealtimeCallback<Order>) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabaseClient() as any;

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        {
          event: '*', // INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'orders',
        },
        (payload: { eventType: string; new: Order; old: Order | null }) => {
          callbackRef.current({
            eventType: payload.eventType,
            new: payload.new as Order,
            old: payload.old as Order | null,
          });
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Connected to orders');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

/**
 * Subscribe to real-time product changes.
 * Used by Admin to reflect inventory changes instantly on the menu.
 */
export function useRealtimeProducts(callback: RealtimeCallback<Product>) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabaseClient() as any;

    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload: { eventType: string; new: Product; old: Product | null }) => {
          callbackRef.current({
            eventType: payload.eventType,
            new: payload.new as Product,
            old: payload.old as Product | null,
          });
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Connected to products');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}

/**
 * Insert an order and broadcast it to the kitchen in real-time.
 */
export async function broadcastNewOrder(orderData: Record<string, unknown>) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    throw error;
  }

  return data as Order;
}

/**
 * Update order status — triggers realtime event to KDS/Delivery.
 */
export async function updateOrderStatus(orderId: string, status: Order['status'], extra?: Record<string, unknown>) {
  const supabase = getSupabaseClient();

  const updateData: Record<string, unknown> = { status };

  // Auto-set timestamps based on status
  if (status === 'preparing') updateData.kitchen_started_at = new Date().toISOString();
  if (status === 'ready') updateData.kitchen_ready_at = new Date().toISOString();
  if (status === 'dispatched') updateData.dispatched_at = new Date().toISOString();
  if (status === 'on_the_way') updateData.assigned_driver_id = extra?.driver_id;
  if (status === 'delivered') updateData.delivered_at = new Date().toISOString();
  if (status === 'cancelled') {
    updateData.cancelled_at = new Date().toISOString();
    updateData.cancellation_reason = extra?.reason;
  }

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    console.error('Error updating order:', error);
    throw error;
  }

  return data as Order;
}
