'use client';

import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '@/types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Recibido',
  preparing: 'Cocinando',
  ready: 'Listo',
  dispatched: 'Despachado',
  on_the_way: 'En Ruta',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'dispatched',
  dispatched: 'on_the_way',
  on_the_way: 'delivered',
  delivered: null,
  cancelled: null,
};

const STATUS_BG: Record<OrderStatus, string> = {
  received: 'rgba(255,255,255,0.1)',
  preparing: 'rgba(255,199,0,0.15)',
  ready: 'rgba(50,215,75,0.15)',
  dispatched: 'rgba(59,130,246,0.15)',
  on_the_way: 'rgba(168,85,247,0.15)',
  delivered: 'rgba(50,215,75,0.15)',
  cancelled: 'rgba(255,69,58,0.15)',
};

const STATUS_TEXT: Record<OrderStatus, string> = {
  received: 'color: #fff',
  preparing: 'color: #FFC700',
  ready: 'color: #32D74B',
  dispatched: 'color: #3B82F6',
  on_the_way: 'color: #A855F7',
  delivered: 'color: #32D74B',
  cancelled: 'color: #FF453A',
};

interface OrderCardProps {
  order: Order;
  onStatusChange: (order: Order) => void;
}

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [elapsed, setElapsed] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = Date.now() - new Date(order.created_at).getTime();
      return Math.floor(diff / 60000);
    };
    setElapsed(calc());
    const interval = setInterval(() => setElapsed(calc()), 30000);
    return () => clearInterval(interval);
  }, [order.created_at]);

  const nextStatus = STATUS_FLOW[order.status];

  const handleNext = async () => {
    if (!nextStatus || isUpdating) return;
    setIsUpdating(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange({ ...order, status: nextStatus });
    } catch {
      onStatusChange({ ...order, status: nextStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      onStatusChange({ ...order, status: 'cancelled' });
    } catch {
      onStatusChange({ ...order, status: 'cancelled' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(28,28,30,0.6)',
      animation: 'fadeIn 0.3s ease-out',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>
            #{order.order_number}
          </span>
          <span style={{
            padding: '2px 10px',
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 600,
            ...STATUS_TEXT[order.status],
            background: STATUS_BG[order.status],
          }}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <span style={{
          fontSize: 13,
          fontWeight: 700,
          fontFamily: 'monospace',
          color: elapsed < 10 ? 'rgba(255,255,255,0.5)' : elapsed < 15 ? '#FFC700' : '#FF453A',
        }}>
          {elapsed}min
        </span>
      </div>

      {/* Customer */}
      <div style={{ padding: '8px 16px', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{order.customer_name}</span>
        <span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>
        <span>{order.customer_phone}</span>
        {order.customer_address && order.customer_address !== 'En local' && (
          <>
            <span style={{ margin: '0 6px', opacity: 0.3 }}>·</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{order.customer_address}</span>
          </>
        )}
      </div>

      {/* Items */}
      <div style={{ padding: '8px 16px' }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <span style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>
                {item.quantity}x {item.name}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', marginLeft: 8 }}>
                ${item.total_price.toFixed(2)}
              </span>
            </div>
            {item.removed_ingredients && item.removed_ingredients.length > 0 && (
              <p style={{ fontSize: 10, color: 'rgba(255,69,58,0.6)', marginTop: 2, paddingLeft: 4 }}>
                Sin: {item.removed_ingredients.join(', ')}
              </p>
            )}
            {item.notes && (
              <p style={{ fontSize: 10, color: 'rgba(255,199,0,0.6)', marginTop: 2, paddingLeft: 4 }}>
                {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.3)',
            background: 'rgba(255,255,255,0.04)',
            padding: '2px 8px',
            borderRadius: 99,
          }}>
            {order.payment_method === 'cash_usd' ? 'Efectivo USD' :
             order.payment_method === 'cash_ves' ? 'Efectivo VES' :
             order.payment_method === 'pago_movil' ? 'Pago Movil' :
             order.payment_method === 'zelle' ? 'Zelle' :
             order.payment_method === 'binance' ? 'Binance' : order.payment_method}
          </span>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#FFC700' }}>
            ${order.total.toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              style={{
                width: 32, height: 32, borderRadius: 99,
                background: 'rgba(255,255,255,0.04)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: 'rgba(255,69,58,0.7)',
              }}
            >
              X
            </button>
          )}
          {nextStatus && (
            <button
              onClick={handleNext}
              disabled={isUpdating}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 99, border: 'none',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: nextStatus === 'preparing' ? '#FFC700' :
                            nextStatus === 'ready' ? '#32D74B' :
                            nextStatus === 'dispatched' ? '#3B82F6' :
                            nextStatus === 'on_the_way' ? '#A855F7' :
                            '#32D74B',
                color: ['preparing', 'ready', 'delivered'].includes(nextStatus) ? '#000' : '#fff',
              }}
            >
              {STATUS_LABELS[nextStatus]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
