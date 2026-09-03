'use client';

import { useState, useEffect } from 'react';
import { Phone, MessageCircle, MapPin, Package, Clock, Truck, Navigation } from 'lucide-react';
import type { Order } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function DeliveryApp() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'delivered'>('pending');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch {}
    };
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const pending = orders.filter((o) => ['received', 'preparing', 'ready'].includes(o.status));
  const active = orders.filter((o) => ['dispatched', 'on_the_way'].includes(o.status));
  const delivered = orders.filter((o) => o.status === 'delivered');
  const list = activeTab === 'pending' ? pending : activeTab === 'active' ? active : delivered;

  const accept = async (o: Order) => {
    await fetch(`/api/orders/${o.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'on_the_way' }),
    });
    setOrders((p) => p.map((x) => x.id === o.id ? { ...x, status: 'on_the_way' as const } : x));
    toast.success(`Pedido #${o.order_number} aceptado`);
  };

  const deliver = async (o: Order) => {
    await fetch(`/api/orders/${o.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    });
    setOrders((p) => p.filter((x) => x.id !== o.id));
    setSelectedOrder(null);
    toast.success(`Pedido #${o.order_number} entregado`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Truck className="w-6 h-6 text-[#FFC700]" />
          <h1 className="text-xl font-bold">Delivery</h1>
          <span className="bg-[#FFC700] text-black text-xs font-bold px-2 py-0.5 rounded-full">{pending.length + active.length}</span>
        </div>
        <div className="flex gap-2">
          {([['pending', 'Pendientes', pending.length], ['active', 'En Ruta', active.length], ['delivered', 'Entregados', delivered.length]] as const).map(([key, label, count]) => (
            <button key={key} onClick={() => setActiveTab(key)} className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all', activeTab === key ? 'bg-[#FFC700] text-black' : 'bg-white/5 text-white/40')}>
              {label} ({count})
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto">
        {list.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30">No hay pedidos</p>
          </div>
        ) : (
          list.map((o) => {
            const mins = Math.floor((Date.now() - new Date(o.created_at).getTime()) / 60000);
            const phone = o.customer_phone || '';
            const phoneClean = phone.replace(/[^0-9]/g, '');
            return (
              <div key={o.id} className="bg-[#1C1C1E] rounded-2xl border border-white/5 p-4 mb-3">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-bold">#{o.order_number}</span>
                    <span className="ml-2 text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">{o.status}</span>
                  </div>
                  <span className="text-xs text-white/30 flex items-center gap-1"><Clock className="w-3 h-3" />{mins}min</span>
                </div>

                <p className="text-sm text-white/60 mb-1">{o.customer_name}</p>
                <p className="text-xs text-white/30 mb-2">{phone}</p>

                {/* Botones de accion rapida */}
                <div className="flex gap-2 mb-3">
                  <a href={`tel:${phone}`} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#32D74B]/15 text-[#32D74B] text-xs font-medium">
                    <Phone className="w-3.5 h-3.5" /> Llamar
                  </a>
                  <a href={`https://wa.me/${phoneClean}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/15 text-[#25D366] text-xs font-medium">
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                  {o.customer_address && o.customer_address !== 'En local' && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.customer_address)}`} target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/15 text-blue-400 text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5" /> GPS
                    </a>
                  )}
                </div>

                {/* Direccion */}
                {o.customer_address && o.customer_address !== 'En local' && (
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.customer_address)}`} target="_blank" className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/5 border border-blue-500/15 mb-3">
                    <Navigation className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-blue-300 truncate">{o.customer_address}</span>
                  </a>
                )}

                {/* Items */}
                <div className="border-t border-white/5 pt-2 mb-2">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-white/40">{item.quantity}x {item.name}</span>
                      <span className="text-white/25">${item.total_price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Total + Boton */}
                <div className="flex justify-between items-center border-t border-white/5 pt-3">
                  <span className="text-sm font-bold text-[#FFC700]">${o.total.toFixed(2)}</span>
                  <div className="flex gap-2">
                    {activeTab === 'pending' && (
                      <button onClick={() => accept(o)} className="px-4 py-2 rounded-full bg-[#FFC700] text-black text-xs font-bold">Aceptar</button>
                    )}
                    {activeTab === 'active' && (
                      <button onClick={() => deliver(o)} className="px-4 py-2 rounded-full bg-[#32D74B] text-black text-xs font-bold">Entregar</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
