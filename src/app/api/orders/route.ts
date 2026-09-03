import { NextRequest, NextResponse } from 'next/server';
import { getOrders, addOrder, getNextOrderNumber } from '@/lib/order-store';
import type { Order } from '@/types';

// GET /api/orders - List all orders (cached for 1s)
export async function GET() {
  const orders = getOrders();
  return NextResponse.json(orders, {
    headers: {
      'Cache-Control': 'public, s-maxage=1, stale-while-revalidate=2',
      'CDN-Cache-Control': 'public, s-maxage=1',
    },
  });
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  const body = await request.json();
  const now = new Date().toISOString();
  const orderNumber = getNextOrderNumber();

  const order: Order = {
    id: 'order-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
    order_number: orderNumber,
    customer_name: body.customer_name || 'Cliente',
    customer_phone: body.customer_phone || '',
    customer_address: body.customer_address || null,
    customer_lat: body.customer_lat || null,
    customer_lng: body.customer_lng || null,
    customer_notes: body.customer_notes || null,
    items: body.items || [],
    subtotal: body.subtotal || 0,
    delivery_fee: body.delivery_fee || 0,
    total: body.total || 0,
    payment_method: body.payment_method || 'cash_usd',
    payment_confirmed: true,
    status: 'received',
    assigned_driver_id: null,
    estimated_delivery_time: null,
    actual_delivery_time: null,
    kitchen_started_at: null,
    kitchen_ready_at: null,
    dispatched_at: null,
    delivered_at: null,
    cancelled_at: null,
    cancellation_reason: null,
    created_at: now,
    updated_at: now,
  };

  addOrder(order);
  return NextResponse.json(order, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
