'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat, Bell, RefreshCw, LayoutGrid, List,
  Volume2, VolumeX, Filter
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRealtimeOrders } from '@/lib/supabase/realtime';
import { useOrderStore } from '@/stores/orders';
import type { Order, OrderStatus } from '@/types';
import { STATUS_LABELS } from '@/types';
import OrderCard from '@/components/kds/OrderCard';
import { cn } from '@/lib/utils';
import { DEMO_ORDERS } from '@/lib/demo-orders';

type ViewMode = 'grid' | 'list';
type StatusFilter = OrderStatus | 'all';

export default function KitchenDisplay() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const prevOrderCountRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play notification sound on new orders
  const playNotificationSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      // Apple-style notification sound
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(440, audioContext.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      // Silent fail if audio not supported
    }
  }, [soundEnabled]);

  // Poll API for orders (cross-device sync)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const allOrders = await res.json();
        const active = allOrders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled');
        
        setOrders((prev) => {
          const prevIds = prev.map((o) => o.id).join(',');
          const currIds = active.map((o: any) => o.id).join(',');
          if (prevIds !== currIds || prev.length !== active.length) {
            if (active.length > prev.length) playNotificationSound();
            return active;
          }
          return prev.map((o) => {
            const updated = active.find((a: any) => a.id === o.id);
            if (updated && updated.status !== o.status) return updated;
            return o;
          });
        });
      } catch {
        // Fallback to local store
        const current = useOrderStore.getState().getActiveOrders();
        setOrders(current);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  // Real-time order updates
  useRealtimeOrders(({ eventType, new: newOrder, old }) => {
    if (eventType === 'INSERT') {
      setOrders((prev) => [...prev, newOrder]);
      playNotificationSound();
    }

    if (eventType === 'UPDATE') {
      setOrders((prev) => {
        const updated = prev.map((o) => (o.id === newOrder.id ? newOrder : o));
        // Remove delivered/cancelled orders after 5 seconds
        if (newOrder.status === 'delivered' || newOrder.status === 'cancelled') {
          setTimeout(() => {
            setOrders((prev) => prev.filter((o) => o.id !== newOrder.id));
          }, 5000);
        }
        return updated;
      });
    }

    if (eventType === 'DELETE' && old) {
      setOrders((prev) => prev.filter((o) => o.id !== old.id));
    }
  });

  const handleStatusChange = (updatedOrder: Order) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
    );
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const orderCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-cholesterol-yellow" />
                <h1 className="text-xl font-bold text-white">
                  Kitchen Display
                </h1>
              </div>
              <span className="bg-cholesterol-yellow text-black text-sm font-bold px-3 py-1 rounded-full">
                {orders.length} activos
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Sound toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="btn-icon"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-white/60" />
                ) : (
                  <VolumeX className="w-4 h-4 text-white/40" />
                )}
              </button>

              {/* View mode */}
              <div className="flex glass-card rounded-apple-xs overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-cholesterol-yellow text-black' : 'text-white/40'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-cholesterol-yellow text-black' : 'text-white/40'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Status filters */}
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setStatusFilter('all')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-medium transition-all',
                statusFilter === 'all'
                  ? 'bg-cholesterol-yellow text-black'
                  : 'glass-card text-white/50 hover:text-white'
              )}
            >
              Todos ({orders.length})
            </button>
            {(['received', 'preparing', 'ready'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                  statusFilter === status
                    ? 'bg-cholesterol-yellow text-black'
                    : 'glass-card text-white/50 hover:text-white'
                )}
              >
                {STATUS_LABELS[status]} ({orderCounts[status] || 0})
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Orders */}
      <main className="max-w-7xl mx-auto px-5 py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-apple-sm" />
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">👨‍🍳</p>
            <p className="text-white/40 text-lg font-medium">
              No hay pedidos pendientes
            </p>
            <p className="text-white/20 text-sm mt-1">
              Los nuevos pedidos aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div className={cn(
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3 max-w-2xl mx-auto'
          )}>
            <AnimatePresence mode="popLayout">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
