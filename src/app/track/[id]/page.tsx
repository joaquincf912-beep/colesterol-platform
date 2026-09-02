'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Clock, ChefHat, CheckCircle, Truck, MapPin,
  Phone, MessageCircle, ArrowLeft, RefreshCw, Search
} from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { formatPrice, cn } from '@/lib/utils';
import { DEMO_ORDERS } from '@/lib/demo-orders';
import type { Order, OrderStatus } from '@/types';

const STATUS_FLOW: { key: OrderStatus; label: string; icon: typeof Package; description: string }[] = [
  { key: 'received', label: 'Recibido', icon: Package, description: 'Tu pedido fue recibido' },
  { key: 'preparing', label: 'Cocinando', icon: ChefHat, description: 'Estamos preparando tu pedido' },
  { key: 'ready', label: 'Listo', icon: CheckCircle, description: 'Tu pedido esta listo' },
  { key: 'dispatched', label: 'Despachado', icon: Truck, description: 'Un repartidor lo esta recogiendo' },
  { key: 'on_the_way', label: 'En Camino', icon: MapPin, description: 'Tu pedido va en camino' },
  { key: 'delivered', label: 'Entregado', icon: CheckCircle, description: 'Pedido entregado' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  // Extract order ID from params or URL path fallback
  const orderId = useMemo(() => {
    if (params?.id) return Array.isArray(params.id) ? params.id[0] : String(params.id);
    // Fallback: extract from URL path /track/1001
    const match = pathname?.match(/\/track\/(\d+)/);
    return match?.[1];
  }, [params, pathname]);

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const fetchOrder = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setError('');

    const numId = parseInt(id);

    // Always check demo data first (fast, no network)
    const demoOrder = DEMO_ORDERS.find((o) => o.order_number === numId);
    if (demoOrder) {
      setOrder(demoOrder);
      setIsLoading(false);
      return;
    }

    // Try Supabase
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!url || url.includes('your-')) {
        setError('Pedido no encontrado. Verifica el numero.');
        setIsLoading(false);
        return;
      }

      const supabase = getSupabaseClient();
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', numId)
        .single();

      if (data && !fetchError) {
        setOrder(data as Order);
        localStorage.setItem('colesterol_last_order', JSON.stringify({
          orderId: data.id,
          orderNumber: data.order_number,
        }));
      } else {
        setError('Pedido no encontrado. Verifica el numero.');
      }
    } catch {
      setError('Pedido no encontrado.');
    }
    setIsLoading(false);
  }, []);

  // Load order on mount
  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
      setSearchInput(orderId);
    } else {
      // Try localStorage recovery
      const stored = localStorage.getItem('colesterol_last_order');
      if (stored) {
        try {
          const { orderNumber } = JSON.parse(stored);
          fetchOrder(String(orderNumber));
          setSearchInput(String(orderNumber));
        } catch {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
  }, [orderId, fetchOrder]);

  // Real-time subscription
  useEffect(() => {
    if (!order) return;

    try {
      const supabase = getSupabaseClient();
      const channel = supabase
        .channel(`tracking-${order.id}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${order.id}`,
        }, (payload: any) => {
          setOrder((prev) => prev ? { ...prev, ...payload.new } : prev);
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Demo mode — no realtime
    }
  }, [order?.id]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.push(`/track/${searchInput.trim()}`);
      fetchOrder(searchInput.trim());
    }
  };

  const currentStatusIdx = order
    ? STATUS_FLOW.findIndex((s) => s.key === order.status)
    : -1;

  const isDelivered = order?.status === 'delivered';
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-white/5"
        style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/')}
            className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-white/60" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-white">Seguimiento</h1>
            <p className="text-[10px] text-white/30">Tiempo real</p>
          </div>
          {order && (
            <button
              onClick={() => fetchOrder(String(order.order_number))}
              className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white/40" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6">
        <AnimatePresence mode="wait">
          {/* SEARCH STATE */}
          {!order && !isLoading && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center pt-12">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-white/20" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Busca tu pedido</h2>
                <p className="text-sm text-white/30">Ingresa el numero de tu pedido para ver el estado</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="number"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Numero de pedido"
                  className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl px-5 py-4 text-lg text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFC700]/30 transition-colors font-mono tabular-nums"
                />
                <button
                  onClick={handleSearch}
                  disabled={!searchInput.trim()}
                  className={cn(
                    'px-6 py-4 rounded-2xl font-semibold text-sm transition-all',
                    searchInput.trim()
                      ? 'bg-[#FFC700] text-black hover:bg-[#FFD633]'
                      : 'bg-white/5 text-white/20 cursor-not-allowed'
                  )}
                >
                  Buscar
                </button>
              </div>
            </motion.div>
          )}

          {/* LOADING */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center pt-20"
            >
              <div className="w-8 h-8 border-2 border-[#FFC700]/30 border-t-[#FFC700] rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-white/30">Buscando pedido...</p>
            </motion.div>
          )}

          {/* ORDER TRACKING */}
          {order && !isLoading && (
            <motion.div
              key="tracking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Order Number */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                    isDelivered ? 'bg-green-500/10' : isCancelled ? 'bg-red-500/10' : 'bg-[#FFC700]/10'
                  )}
                >
                  {isDelivered ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : isCancelled ? (
                    <Package className="w-8 h-8 text-red-400" />
                  ) : (
                    <span className="text-2xl font-black text-[#FFC700]">
                      #{order.order_number}
                    </span>
                  )}
                </motion.div>
                <p className="text-[11px] text-white/30 uppercase tracking-wider">
                  {isDelivered ? 'Pedido Entregado' : isCancelled ? 'Pedido Cancelado' : `Pedido #${order.order_number}`}
                </p>
              </div>

              {/* Progress Bar */}
              {!isCancelled && (
                <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-white/60">Estado del Pedido</p>
                    <span className="text-[10px] text-[#FFC700] font-medium">
                      {STATUS_FLOW[currentStatusIdx]?.label || 'Desconocido'}
                    </span>
                  </div>

                  {/* Visual Progress */}
                  <div className="flex items-center gap-1 mb-6">
                    {STATUS_FLOW.slice(0, 5).map((status, i) => (
                      <div key={status.key} className="flex-1 flex items-center">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: i <= currentStatusIdx ? '100%' : '0%' }}
                            transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={cn(
                              'h-full rounded-full',
                              i <= currentStatusIdx ? 'bg-[#FFC700]' : 'bg-white/5'
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Status Steps */}
                  <div className="space-y-3">
                    {STATUS_FLOW.map((status, i) => {
                      const isCompleted = i < currentStatusIdx;
                      const isCurrent = i === currentStatusIdx;
                      const isFuture = i > currentStatusIdx;

                      return (
                        <motion.div
                          key={status.key}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            'flex items-center gap-3 p-2.5 rounded-xl transition-all',
                            isCurrent && 'bg-[#FFC700]/5 border border-[#FFC700]/10',
                            isFuture && 'opacity-30'
                          )}
                        >
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            isCompleted ? 'bg-green-500/10' : isCurrent ? 'bg-[#FFC700]/10' : 'bg-white/[0.03]'
                          )}>
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <status.icon className={cn(
                                'w-4 h-4',
                                isCurrent ? 'text-[#FFC700]' : 'text-white/20'
                              )} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              'text-xs font-semibold',
                              isCurrent ? 'text-[#FFC700]' : isCompleted ? 'text-white/60' : 'text-white/20'
                            )}>
                              {status.label}
                            </p>
                            <p className="text-[10px] text-white/20 truncate">{status.description}</p>
                          </div>
                          {isCurrent && (
                            <div className="w-2 h-2 rounded-full bg-[#FFC700] animate-pulse" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Estimated Time */}
              {order.estimated_delivery_time && !isDelivered && !isCancelled && (
                <div className="bg-[#FFC700]/5 border border-[#FFC700]/10 rounded-2xl p-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#FFC700]" />
                  <div>
                    <p className="text-xs font-semibold text-[#FFC700]">Tiempo estimado</p>
                    <p className="text-[11px] text-white/40">
                      {new Date(order.estimated_delivery_time).toLocaleTimeString('es-VE', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="bg-[#1C1C1E] rounded-2xl p-5 border border-white/5">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                  Tu Pedido
                </p>
                <div className="space-y-2.5">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div>
                        <span className="text-white/70">{item.quantity}x</span>
                        <span className="text-white/90 ml-1.5">{item.name}</span>
                      </div>
                      <span className="text-white/50 font-mono tabular-nums">
                        {formatPrice(item.total_price)}
                      </span>
                    </div>
                  ))}
                  {order.delivery_fee > 0 && (
                    <div className="flex justify-between text-sm pt-2 border-t border-white/5">
                      <span className="text-white/30">Envio</span>
                      <span className="text-white/40">{formatPrice(order.delivery_fee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/5">
                    <span className="font-semibold text-white">Total</span>
                    <span className="font-bold text-[#FFC700]">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex gap-2">
                <a
                  href={`tel:${order.customer_phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/[0.04] text-white/50 text-xs font-medium hover:bg-white/[0.06] transition-all border border-white/[0.04]"
                >
                  <Phone className="w-3.5 h-3.5" /> Llamar
                </a>
                <a
                  href={`https://wa.me/${order.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola, quiero saber sobre mi pedido #${order.order_number}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-[#25D366]/10 text-[#25D366] text-xs font-medium hover:bg-[#25D366]/20 transition-all border border-[#25D366]/10"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>

              {/* Search Again */}
              <button
                onClick={() => {
                  setOrder(null);
                  setError('');
                  setSearchInput('');
                  router.push('/track');
                }}
                className="w-full py-3 text-center text-xs text-white/20 hover:text-white/40 transition-colors"
              >
                Buscar otro pedido
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
