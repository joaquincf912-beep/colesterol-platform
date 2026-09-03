'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Check, Package, Clock, Truck } from 'lucide-react';
import type { Order } from '@/types';
import { STATUS_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function DeliveryApp() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'delivered'>('pending');

  // Poll API for delivery orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const allOrders = await res.json();
        setOrders(allOrders);
      } catch {
        // keep current state
      }
      setIsLoading(false);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptOrder = async (order: Order) => {
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'on_the_way' }),
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
  const deliveredOrders = orders.filter((o) => o.status === 'delivered');

  const displayOrders = activeTab === 'pending' ? pendingOrders : activeTab === 'active' ? activeOrders : deliveredOrders;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-[#FFC700]" />
            <h1 className="text-xl font-bold text-white">Delivery</h1>
            <span className="bg-[#FFC700] text-black text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingOrders.length + activeOrders.length}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium transition-all',
                activeTab === 'pending' ? 'bg-[#FFC700] text-black' : 'bg-white/5 text-white/50'
              )}
            >
              Pendientes ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium transition-all',
                activeTab === 'active' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/50'
              )}
            >
              En Ruta ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('delivered')}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-medium transition-all',
                activeTab === 'delivered' ? 'bg-[#32D74B] text-black' : 'bg-white/5 text-white/50'
              )}
            >
              Entregados ({deliveredOrders.length})
            </button>
          </div>
        </div>
      </header>

      {/* Orders */}
      <main className="max-w-2xl mx-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : displayOrders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/40 text-lg">No hay pedidos</p>
            <p className="text-white/20 text-sm mt-1">
              {activeTab === 'pending' ? 'Esperando pedidos listos para recoger' : 'Los pedidos apareceran aqui'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAccept={handleAcceptOrder}
                onDeliver={handleDeliverOrder}
                onSelect={setSelectedOrder}
                activeTab={activeTab}
              />
            ))}
          </div>
        )}
      </main>

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-[#1C1C1E] rounded-t-3xl w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Pedido #{selectedOrder.order_number}</h3>
            <p className="text-sm text-white/40 mb-4">{selectedOrder.customer_name} — {selectedOrder.customer_phone}</p>
            <div className="space-y-2 mb-4">
              {selectedOrder.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-white/60">{item.quantity}x {item.name}</span>
                  <span className="text-white/40">${item.total_price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-3">
              <span className="text-white">Total</span>
              <span className="text-[#FFC700]">${selectedOrder.total.toFixed(2)}</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <a
                href={`tel:${selectedOrder.customer_phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#32D74B]/15 text-[#32D74B] text-sm font-medium"
              >
                <Phone className="w-4 h-4" /> Llamar
              </a>
              <a
                href={`https://wa.me/${selectedOrder.customer_phone?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#25D366]/15 text-[#25D366] text-sm font-medium"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.customer_address || '')}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-500/15 text-blue-400 text-sm font-medium"
              >
                <MapPin className="w-4 h-4" /> Maps
              </a>
            </div>

            {activeTab === 'active' && (
              <button
                onClick={() => { handleDeliverOrder(selectedOrder); }}
                className="w-full mt-3 py-3 rounded-2xl bg-[#32D74B] text-black text-sm font-bold"
              >
                Marcar como Entregado
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onAccept, onDeliver, onSelect, activeTab }: {
  order: Order;
  onAccept: (o: Order) => void;
  onDeliver: (o: Order) => void;
  onSelect: (o: Order) => void;
  activeTab: string;
}) {
  const elapsed = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

  return (
    <div
      className="bg-[#1C1C1E] rounded-2xl border border-white/5 overflow-hidden"
      onClick={() => onSelect(order)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">#{order.order_number}</span>
            <span className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-semibold',
              order.status === 'ready' ? 'bg-[#FFC700]/15 text-[#FFC700]' :
              order.status === 'on_the_way' ? 'bg-blue-500/15 text-blue-400' :
              'bg-[#32D74B]/15 text-[#32D74B]'
            )}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <span className="text-xs text-white/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {elapsed}min
          </span>
        </div>

        <p className="text-sm text-white/50 mb-1">{order.customer_name}</p>
        <p className="text-xs text-white/25 mb-3">{order.customer_address || 'Sin direccion'}</p>

        <div className="space-y-1">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-white/40">{item.quantity}x {item.name}</span>
              <span className="text-white/25">${item.total_price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
          <span className="text-sm font-bold text-[#FFC700]">${order.total.toFixed(2)}</span>

          {activeTab === 'pending' && (
            <button
              onClick={(e) => { e.stopPropagation(); onAccept(order); }}
              className="px-4 py-2 rounded-full bg-[#FFC700] text-black text-xs font-bold"
            >
              Aceptar
            </button>
          )}
          {activeTab === 'active' && (
            <button
              onClick={(e) => { e.stopPropagation(); onDeliver(order); }}
              className="px-4 py-2 rounded-full bg-[#32D74B] text-black text-xs font-bold"
            >
              Entregar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
