import { NextResponse } from 'next/server';
import { orderStore } from '@/lib/book-orders-store';

// GET /api/book-orders -> list all book orders (paid, pending, declined...)
// Reads from Supabase when available, falls back to the in-memory store fed by the PayPal flow.

export async function GET() {
  const orders: Record<string, unknown>[] = [];

  // 1. Supabase (source of truth when configured)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, serviceKey);
      const { data } = await supabase
        .from('book_orders')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(200);
      if (data) orders.push(...data);
    } catch {
      // ignore, fall back below
    }
  }

  // 2. In-memory store
  const seen = new Set(orders.map(o => o.reference));
  for (const o of orderStore().values()) {
    if (!seen.has(o.reference)) orders.push(o);
  }

  return NextResponse.json({ orders });
}
