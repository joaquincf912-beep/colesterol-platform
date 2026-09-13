import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { orderStore } from '@/lib/book-orders-store';

// Wompi events webhook
// Receives transaction updates (payment confirmed/rejected) and stores book orders.
// Configure in Wompi Dashboard -> Desarrolladores -> Eventos (webhook URL).
// Env vars:
//   WOMPI_EVENTS_SECRET -> prod_events_xxx (from Wompi dashboard)
//   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (optional; falls back to in-memory store)

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate checksum if events secret is configured
    const eventsSecret = process.env.WOMPI_EVENTS_SECRET;
    const checksumReceived = body?.signature?.checksum;
    if (eventsSecret && checksumReceived) {
      const concat = [
        body?.data?.transaction?.id,
        body?.data?.transaction?.status,
        body?.data?.transaction?.amount_in_cents,
        body?.timestamp,
        eventsSecret,
      ].join('');
      const expected = crypto.createHash('sha256').update(concat).digest('hex');
      if (expected !== checksumReceived) {
        return NextResponse.json({ error: 'Invalid checksum' }, { status: 401 });
      }
    }

    // 2. Extract transaction data
    const transaction = body?.data?.transaction;
    if (!transaction) {
      return NextResponse.json({ ok: true, ignored: 'no transaction' });
    }

    const statusMap: Record<string, string> = {
      APPROVED: 'paid',
      DECLINED: 'declined',
      VOIDED: 'voided',
      ERROR: 'error',
      PENDING: 'pending',
    };
    const status = statusMap[transaction.status] || 'unknown';
    const reference: string = transaction.reference || '';

    // 3. Try to persist in Supabase (optional)
    let savedToSupabase = false;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey && reference) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, serviceKey);
        const { error } = await supabase.from('book_orders').upsert({
          reference,
          status,
          amount_in_cents: transaction.amount_in_cents,
          customer_email: transaction.customer_email,
          wompi_transaction_id: transaction.id,
          payment_method: transaction.payment_method_type,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'reference' });
        if (!error) savedToSupabase = true;
      } catch {
        // fall through to memory store
      }
    }

    // 4. Always keep in-memory copy (for the admin panel)
    if (reference) {
      const existing = orderStore().get(reference);
      orderStore().set(reference, {
        ...existing,
        reference,
        status,
        amountInCents: transaction.amount_in_cents,
        customerEmail: transaction.customer_email,
        wompiTransactionId: transaction.id,
        paymentMethod: transaction.payment_method_type,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ ok: true, savedToSupabase });
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
