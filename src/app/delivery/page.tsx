'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Phone, MessageCircle, MapPin, Navigation, Check,
  ChevronRight, Package, Clock, Truck
} from 'lucide-react';
import { useOrderStore } from '@/stores/orders';
import type { Order } from '@/types';
import { STATUS_LABELS } from '@/types';
import { formatTime, cn } from '@/lib/utils';
import { toast } from 'sonner';


export default function DeliveryApp() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'delivered'>('pending');

  // Subscribe to shared order store (real-time cross-tab sync)
  useEffect(() => {
    const deliveryStatuses = ['ready', 'dispatched', 'on_the_way'];
    
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const allOrders = await res.json();
        const filtered = allOrders.filter((o: any) => deliveryStatuses.includes(o.status));
        setOrders(filtered);
      } catch {
        const store = useOrderStore.getState();
        const filtered = store.orders.filter((o: any) => deliveryStatuses.includes(o.status));
        setOrders(filtered);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    setIsLoading(false);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (order: Order) => {
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'on_the_way', extra: { driver_id: 'current-driver-id' } }),
      });
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'on_the_way' as const } : o)));
      toast.success(`Pedido #${order.order_number} aceptado`);
    } catch {
      toast.error('Error al aceptar pedido');
    }
  };

  const handleDeliverOrder = async (order: Order) => {
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }),
      });
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      setSelectedOrder(null);
      toast.success(`Pedido #${order.order_number} entregado`);
    } catch {
      toast.error('Error al entregar pedido');
    }
  };

  const pendingOrders = orders.filter((o) => o.status === 'ready');
  const activeOrders = orders.filter((o) => o.status === 'dispatched' || o.status === 'on_the_way');

  const currentOrders = activeTab === 'pending' ? pendingOrders
    : activeTab === 'active' ? activeOrders
    : [];

  return (
    <div className="min-h-screen bg-black max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/5 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-cholesterol-yellow" />
            <h1 className="text-lg font-bold text-white">Delivery</h1>
          </div>
          <span className="text-xs text-white/30">
            {activeOrders.length} en ruta
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-3 glass-card rounded-apple-xs p-1">
          {(['pending', 'active'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 rounded-apple-xs text-xs font-medium transition-all',
                activeTab === tab
                  ? 'bg-cholesterol-yellow text-black'
                  : 'text-white/50'
              )}
            >
              {tab === 'pending' ? `Pendientes (${pendingOrders.length})` : `En Ruta (${activeOrders.length})`}
            </button>
          ))}
        </div>
      </header>

      {/* Orders List */}
      <main className="px-5 py-4 space-y-3 pb-32">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-apple-sm" />
          ))
        ) : currentOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/40 text-sm">
              {activeTab === 'pending' ? 'No hay pedidos listos para recoger' : 'No tienes pedidos activos'}
            </p>
          </div>
        ) : (
          currentOrders.map((order) => (
            <DeliveryOrderCard
              key={order.id}
              order={order}
              isActive={activeTab === 'active'}
              onAccept={() => handleAcceptOrder(order)}
              onDeliver={() => handleDeliverOrder(order)}
              onSelect={() => setSelectedOrder(order)}
            />
          ))
        )}
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onDeliver={() => handleDeliverOrder(selectedOrder)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DeliveryOrderCard({
  order,
  isActive,
  onAccept,
  onDeliver,
  onSelect,
}: {
  order: Order;
  isActive: boolean;
  onAccept: () => void;
  onDeliver: () => void;
  onSelect: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-apple-sm overflow-hidden"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">#{order.order_number}</span>
            <span className="text-xs text-white/30">{formatTime(order.created_at)}</span>
          </div>
          <span className="text-sm font-bold text-cholesterol-yellow">
            ${order.total.toFixed(2)}
          </span>
        </div>

        {/* Customer */}
        <div className="space-y-1 mb-3">
          <p className="text-sm text-white/70 font-medium">{order.customer_name}</p>
          <p className="text-xs text-white/40">{order.customer_phone}</p>
          <div className="flex items-start gap-1.5 text-xs text-white/40">
            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>{order.customer_address}</span>
          </div>
        </div>

        {/* Items summary */}
        <p className="text-xs text-white/30 mb-3">
          {order.items.length} producto{order.items.length !== 1 ? 's' : ''} ·{' '}
          {order.items.reduce((sum, item) => sum + item.quantity, 0)} unidades
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          {/* Quick contact buttons */}
          <a
            href={`tel:${order.customer_phone}`}
            className="btn-icon !p-2.5"
          >
            <Phone className="w-4 h-4 text-cholesterol-green" />
          </a>
          <a
            href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon !p-2.5"
          >
            <MessageCircle className="w-4 h-4 text-cholesterol-green" />
          </a>

          {/* Map button */}
          {order.customer_address && (
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer_address || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-icon !p-2.5"
            >
              <Navigation className="w-4 h-4 text-blue-400" />
            </a>
          )}

          <div className="flex-1" />

          {/* Primary action */}
          {isActive ? (
            <SwipeToDeliver onDeliver={onDeliver} />
          ) : (
            <button onClick={onAccept} className="btn-primary !px-4 !py-2 text-sm flex items-center gap-1">
              Aceptar <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SwipeToDeliver({ onDeliver }: { onDeliver: () => void }) {
  const x = useMotionValue(0);
  const opacity = useTransform(x, [0, 150], [0.5, 1]);
  const bg = useTransform(x, [0, 150], ['#2C2C2E', '#32D74B']);
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="relative h-10 w-40 rounded-apple-xs overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 flex items-center justify-center rounded-apple-xs"
        style={{ backgroundColor: bg }}
      >
        <motion.span style={{ opacity }} className="text-xs font-bold text-white pl-2">
          → Entregado
        </motion.span>
      </motion.div>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 140 }}
        dragElastic={0}
        onDragEnd={(_, info) => {
          if (info.offset.x > 120) {
            setIsComplete(true);
            onDeliver();
          }
        }}
        className="absolute inset-y-1 left-1 w-8 bg-cholesterol-green rounded-apple-xs flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10"
      >
        <Check className="w-4 h-4 text-white" />
      </motion.div>
    </div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onDeliver,
}: {
  order: Order;
  onClose: () => void;
  onDeliver: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end backdrop-blur-overlay"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="w-full max-w-md mx-auto glass-strong rounded-t-apple-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        <div className="px-6 py-4 space-y-4">
          <h2 className="text-lg font-bold text-white">
            Pedido #{order.order_number}
          </h2>

          {/* Items */}
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span className="text-white/60">
                  {item.quantity}x {item.name}
                </span>
                {item.notes && (
                  <span className="text-cholesterol-yellow/50 text-xs">Nota</span>
                )}
              </div>
            ))}
          </div>

          {/* Address with map link */}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.customer_address || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card rounded-apple-sm p-4 flex items-center gap-3 block"
          >
            <MapPin className="w-5 h-5 text-cholesterol-yellow flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-white font-medium">{order.customer_address}</p>
              <p className="text-xs text-white/40 mt-0.5">Abrir en Google Maps →</p>
            </div>
          </a>

          {/* Contact buttons */}
          <div className="flex gap-3">
            <a
              href={`tel:${order.customer_phone}`}
              className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
            >
              <Phone className="w-4 h-4" /> Llamar
            </a>
            <a
              href={`https://wa.me/${order.customer_phone?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
