'use client';

import { useState, useEffect } from 'react';

interface OrderCardProps {
  order: any;
  onStatusChange: (order: any) => void;
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

  const statusFlow: Record<string, string | null> = {
    received: 'preparing',
    preparing: 'ready',
    ready: 'dispatched',
    dispatched: 'on_the_way',
    on_the_way: 'delivered',
    delivered: null,
    cancelled: null,
  };

  const statusLabels: Record<string, string> = {
    received: 'Recibido',
    preparing: 'Cocinando',
    ready: 'Listo',
    dispatched: 'Despachado',
    on_the_way: 'En Ruta',
    delivered: 'Entregado',
    cancelled: 'Cancelado',
  };

  const nextStatus = statusFlow[order.status] || null;

  const handleNext = async () => {
    if (!nextStatus || isUpdating) return;
    setIsUpdating(true);
    try {
      await fetch('/api/orders/' + order.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange({ ...order, status: nextStatus });
    } catch (e) {
      onStatusChange({ ...order, status: nextStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await fetch('/api/orders/' + order.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      onStatusChange({ ...order, status: 'cancelled' });
    } catch (e) {
      onStatusChange({ ...order, status: 'cancelled' });
    } finally {
      setIsUpdating(false);
    }
  };

  const bgColor = order.status === 'preparing' ? 'rgba(255,199,0,0.15)' :
                  order.status === 'ready' ? 'rgba(50,215,75,0.15)' :
                  order.status === 'cancelled' ? 'rgba(255,69,58,0.15)' :
                  'rgba(255,255,255,0.1)';

  const textColor = order.status === 'preparing' ? '#FFC700' :
                    order.status === 'ready' ? '#32D74B' :
                    order.status === 'cancelled' ? '#FF453A' :
                    '#FFFFFF';

  const paymentLabel = order.payment_method === 'cash_usd' ? 'Efectivo USD' :
                       order.payment_method === 'cash_ves' ? 'Efectivo VES' :
                       order.payment_method === 'pago_movil' ? 'Pago Movil' :
                       order.payment_method === 'zelle' ? 'Zelle' :
                       order.payment_method === 'binance' ? 'Binance' :
                       order.payment_method || 'Efectivo';

  const nextBtnBg = nextStatus === 'preparing' ? '#FFC700' :
                    nextStatus === 'ready' ? '#32D74B' :
                    nextStatus === 'dispatched' ? '#3B82F6' :
                    nextStatus === 'on_the_way' ? '#A855F7' :
                    '#32D74B';

  const nextBtnText = ['preparing', 'ready', 'delivered'].includes(nextStatus || '') ? '#000' : '#FFF';

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div style={{
      borderRadius: 16,
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'rgba(28,28,30,0.8)',
      animation: 'fadeIn 0.3s ease-out',
      minHeight: 120,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF' }}>
            #{order.order_number}
          </span>
          <span style={{
            padding: '3px 12px',
            borderRadius: 99,
            fontSize: 11,
            fontWeight: 700,
            background: bgColor,
            color: textColor,
          }}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>
        <span style={{
          fontSize: 14,
          fontWeight: 800,
          fontFamily: 'monospace',
          color: elapsed < 10 ? 'rgba(255,255,255,0.5)' : elapsed < 15 ? '#FFC700' : '#FF453A',
        }}>
          {elapsed}min
        </span>
      </div>

      {/* Customer */}
      <div style={{ padding: '10px 16px', fontSize: 13 }}>
        <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{order.customer_name}</div>
        <div style={{ color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{order.customer_phone}</div>
        {order.customer_address && order.customer_address !== 'En local' && (
          <div style={{ color: 'rgba(255,255,255,0.35)', marginTop: 2, fontSize: 12 }}>
            {order.customer_address}
          </div>
        )}
      </div>

      {/* Items */}
      <div style={{ padding: '8px 16px 12px' }}>
        {items.map((item: any, idx: number) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: '#FFFFFF', fontWeight: 600 }}>
                {item.quantity}x {item.name}
              </span>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>
                ${Number(item.total_price).toFixed(2)}
              </span>
            </div>
            {item.removed_ingredients && item.removed_ingredients.length > 0 && (
              <div style={{ fontSize: 11, color: '#FF453A', marginTop: 2, opacity: 0.7 }}>
                Sin: {item.removed_ingredients.join(', ')}
              </div>
            )}
            {item.notes && (
              <div style={{ fontSize: 11, color: '#FFC700', marginTop: 2, opacity: 0.7 }}>
                Nota: {item.notes}
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>Sin items</div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.06)',
            padding: '3px 10px',
            borderRadius: 99,
            fontWeight: 500,
          }}>
            {paymentLabel}
          </span>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#FFC700' }}>
            ${Number(order.total).toFixed(2)}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              style={{
                width: 34, height: 34, borderRadius: 99,
                background: 'rgba(255,69,58,0.12)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#FF453A',
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
                padding: '10px 20px', borderRadius: 99, border: 'none',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                background: nextBtnBg,
                color: nextBtnText,
              }}
            >
              {statusLabels[nextStatus] || nextStatus}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
