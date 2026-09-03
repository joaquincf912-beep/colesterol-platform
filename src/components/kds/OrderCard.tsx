'use client';

import { useState, useEffect } from 'react';
import { Clock, ChefHat, Check, Truck, X } from 'lucide-react';
import type { Order, OrderStatus } from '@/types';
import { STATUS_LABELS, PAYMENT_LABELS } from '@/types';
import { getElapsedMinutes, cn } from '@/lib/utils';
import { updateOrderStatus } from '@/lib/supabase/realtime';
import { toast } from 'sonner';

interface OrderCardProps {
  order: Order;
  onStatusChange: (order: Order) => void;
}

const STATUS_FLOW: Record<OrderStatus, OrderStatus | null> = {
  received: 'preparing',
  preparing: 'ready',
  ready: 'dispatched',
  dispatched: 'on_the_way',
  on_the_way: 'delivered',
  delivered: null,
  cancelled: null,
};

const STATUS_ICONS: Record<OrderStatus, typeof Clock> = {
  received: Clock,
  preparing: ChefHat,
  ready: Check,
  dispatched: Truck,
  on_the_way: Truck,
  delivered: Check,
  cancelled: X,
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  received: 'bg-white/10 text-white',
  preparing: 'bg-cholesterol-yellow/15 text-cholesterol-yellow',
  ready: 'bg-cholesterol-green/15 text-cholesterol-green',
  dispatched: 'bg-blue-500/15 text-blue-400',
  on_the_way: 'bg-purple-500/15 text-purple-400',
  delivered: 'bg-cholesterol-green/15 text-cholesterol-green',
  cancelled: 'bg-cholesterol-red/15 text-cholesterol-red',
};

const NEXT_STATUS_STYLES: Record<string, string> = {
  preparing: 'bg-cholesterol-yellow text-black hover:bg-cholesterol-yellow/90',
  ready: 'bg-cholesterol-green text-black hover:bg-cholesterol-green/90',
  dispatched: 'bg-blue-500 text-white hover:bg-blue-500/90',
  on_the_way: 'bg-purple-500 text-white hover:bg-purple-500/90',
  delivered: 'bg-cholesterol-green text-black hover:bg-cholesterol-green/90',
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
  const [elapsed, setElapsed] = useState(getElapsedMinutes(order.created_at));
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedMinutes(order.created_at));
    }, 30000);
    return () => clearInterval(interval);
  }, [order.created_at]);

  const urgencyClass =
    elapsed < 10 ? 'order-fresh' :
    elapsed < 15 ? 'order-warming' :
    'order-urgent';

  const nextStatus = STATUS_FLOW[order.status];

  const handleStatusUpdate = async () => {
    if (!nextStatus || isUpdating) return;
    setIsUpdating(true);
    try {
      // Update via API (cross-device sync)
      await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      // Also update local store
      updateOrderStatus(order.id, nextStatus);
      onStatusChange({ ...order, status: nextStatus });
      toast.success(`Pedido #${order.order_number} -> ${STATUS_LABELS[nextStatus]}`);
    } catch {
      onStatusChange({ ...order, status: nextStatus });
      toast.success(`Pedido #${order.order_number} -> ${STATUS_LABELS[nextStatus]}`);
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
        body: JSON.stringify({ status: 'cancelled', extra: { reason: 'Cancelado por cocina' } }),
      });
      updateOrderStatus(order.id, 'cancelled');
      onStatusChange({ ...order, status: 'cancelled' });
    } catch {
      onStatusChange({ ...order, status: 'cancelled' });
    } finally {
      setIsUpdating(false);
    }
  };

  const StatusIcon = STATUS_ICONS[order.status];

  return (
    <div
      className={cn(
        'rounded-[16px] overflow-hidden border border-white/[0.06] animate-fade-in',
        urgencyClass
      )}
      style={{
        background: 'rgba(28, 28, 30, 0.6)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-white">
            #{order.order_number}
          </span>
          <span className={cn(
            'px-2.5 py-0.5 rounded-full text-[10px] font-semibold',
            STATUS_COLORS[order.status]
          )}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <StatusIcon className="w-3.5 h-3.5 text-white/30" />
          <span className={cn(
            'text-sm font-mono font-bold tabular-nums',
            elapsed < 10 ? 'text-white/50' :
            elapsed < 15 ? 'text-cholesterol-yellow' :
            'text-cholesterol-red'
          )}>
            {elapsed}min
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="px-4 py-2.5 text-xs text-white/35">
        <span className="font-medium text-white/60">{order.customer_name}</span>
        <span className="mx-2 text-white/15">·</span>
        <span>{order.customer_phone}</span>
        {order.customer_address && (
          <>
            <span className="mx-2 text-white/15">·</span>
            <span className="text-white/25">{order.customer_address}</span>
          </>
        )}
      </div>

      {/* Items */}
      <div className="px-4 py-2.5 space-y-1.5">
        {order.items.map((item, idx) => (
          <div key={idx} className="text-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <span className="text-white font-medium">
                  {item.quantity}x {item.name}
                </span>
              </div>
              <span className="text-white/30 text-xs font-mono ml-2">
                ${item.total_price.toFixed(2)}
              </span>
            </div>
            {/* Customizations */}
            {Object.keys(item.customizations).length > 0 && (
              <p className="text-[10px] text-white/25 mt-0.5 pl-1">
                {Object.entries(item.customizations)
                  .map(([g, v]) => `${g}: ${Array.isArray(v) ? v.join(', ') : v}`)
                  .join(' · ')}
              </p>
            )}
            {item.removed_ingredients.length > 0 && (
              <p className="text-[10px] text-cholesterol-red/50 mt-0.5 pl-1">
                Sin: {item.removed_ingredients.join(', ')}
              </p>
            )}
            {item.notes && (
              <p className="text-[10px] text-cholesterol-yellow/50 mt-0.5 pl-1">                 {item.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer — Payment & Actions */}
      <div className="px-4 py-3 border-t border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-white/25 bg-white/[0.04] px-2 py-0.5 rounded-full">
            {PAYMENT_LABELS[order.payment_method]}
          </span>
          <span className="text-sm font-bold text-cholesterol-yellow">
            ${order.total.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <button
              onClick={handleCancel}
              disabled={isUpdating}
              className="w-8 h-8 rounded-full bg-white/[0.04] flex items-center justify-center hover:bg-cholesterol-red/15 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-cholesterol-red/60" />
            </button>
          )}
          {nextStatus && (
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200',
                NEXT_STATUS_STYLES[nextStatus]
              )}
            >
              {nextStatus === 'preparing' && <ChefHat className="w-3.5 h-3.5" />}
              {nextStatus === 'ready' && <Check className="w-3.5 h-3.5" />}
              {nextStatus === 'dispatched' && <Truck className="w-3.5 h-3.5" />}
              {nextStatus === 'on_the_way' && <Truck className="w-3.5 h-3.5" />}
              {nextStatus === 'delivered' && <Check className="w-3.5 h-3.5" />}
              {STATUS_LABELS[nextStatus]}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
