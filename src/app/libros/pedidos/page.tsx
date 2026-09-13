'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, RefreshCw, Check, X, Clock, ExternalLink } from 'lucide-react';

type BookOrder = {
  reference: string;
  status: string;
  bookId?: string;
  bookTitle?: string;
  childName?: string;
  features?: string[];
  amountInCents?: number;
  customerEmail?: string;
  wompiTransactionId?: string;
  updated_at?: string;
  updatedAt?: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Check }> = {
  paid: { label: 'Pagado', color: 'bg-green-100 text-green-700 border-green-300', icon: Check },
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: Clock },
  declined: { label: 'Rechazado', color: 'bg-red-100 text-red-700 border-red-300', icon: X },
  voided: { label: 'Anulado', color: 'bg-gray-100 text-gray-600 border-gray-300', icon: X },
  error: { label: 'Error', color: 'bg-red-100 text-red-700 border-red-300', icon: X },
};

export default function BookOrdersPage() {
  const [orders, setOrders] = useState<BookOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/book-orders', { cache: 'no-store' });
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      setOrders([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const formatCOP = (cents?: number) =>
    cents ? `$${(cents / 100).toLocaleString('es-CO')}` : '—';

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-yellow-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-5xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" />
            Panel
          </Link>
          <h1 className="text-lg font-black text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-500" />
            Pedidos de Libros
          </h1>
          <button
            onClick={loadOrders}
            className="p-2 rounded-xl bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors"
            aria-label="Recargar"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="max-w-5xl mx-auto px-5 pb-3 flex gap-2 overflow-x-auto">
          {['all', 'paid', 'pending', 'declined'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wide transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-300/40'
                  : 'bg-white text-gray-500 border border-gray-200 hover:border-pink-300'
              }`}
            >
              {f === 'all' ? 'Todos' : STATUS_CONFIG[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 py-6 pb-24">
        {loading && orders.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-5 animate-pulse border border-pink-100">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-800 mb-2">Sin pedidos todavia</h2>
            <p className="text-sm text-gray-500 max-w-sm mx-auto">
              Los pedidos aparecen aqui automaticamente cuando un cliente inicia o completa un pago en la tienda de libros.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              return (
                <div key={order.reference} className="bg-white rounded-2xl p-5 border-2 border-pink-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Referencia</p>
                      <p className="text-sm font-black text-gray-900 break-all">{order.reference}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black border-2 flex-shrink-0 ${statusCfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Libro</p>
                      <p className="font-bold text-gray-800 truncate">{order.bookTitle || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Niño/a</p>
                      <p className="font-bold text-gray-800 truncate">{order.childName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
                      <p className="font-black text-pink-600">{formatCOP(order.amountInCents)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase">Fecha</p>
                      <p className="font-bold text-gray-800">
                        {new Date(order.updated_at || order.updatedAt || Date.now()).toLocaleDateString('es-CO', {
                          day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  {order.features && order.features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {order.features.map((f, i) => (
                        <span key={i} className="px-2.5 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full border border-purple-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  {order.customerEmail && (
                    <p className="text-xs text-gray-400 mt-2 font-medium">{order.customerEmail}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
