import { NextResponse } from 'next/server';
import { orderStore, BookOrder } from '@/lib/book-orders-store';

// Captures an approved PayPal order (called from the confirmation page with ?token=PAYPAL_ORDER_ID).

async function getAccessToken(apiBase: string): Promise<string | null> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token || null;
}

async function updateOrder(reference: string, patch: Partial<BookOrder>) {
  const existing = orderStore().get(reference);
  const record: BookOrder = {
    ...(existing || { reference, status: 'pending', updatedAt: new Date().toISOString() }),
    ...patch,
    reference,
    updatedAt: new Date().toISOString(),
  };
  orderStore().set(reference, record);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseUrl && serviceKey) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, serviceKey);
      await supabase.from('book_orders').upsert(record, { onConflict: 'reference' });
    } catch {
      // ignore
    }
  }
}

export async function POST(req: Request) {
  try {
    const { orderId, reference } = await req.json();
    if (!orderId || !reference) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';
    const accessToken = await getAccessToken(apiBase);
    if (!accessToken) {
      return NextResponse.json({ error: 'Pasarela de pago no configurada' }, { status: 500 });
    }

    const captureRes = await fetch(`${apiBase}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const captureData = await captureRes.json();
    const status = captureData?.status; // COMPLETED | DECLINED | ...
    const capture = captureData?.purchase_units?.[0]?.payments?.captures?.[0];
    const payerEmail = captureData?.payer?.email_address || '';

    if (status === 'COMPLETED') {
      await updateOrder(reference, {
        status: 'paid',
        customerEmail: payerEmail || orderStore().get(reference)?.customerEmail || '',
        paymentMethod: 'paypal',
        paypalTransactionId: capture?.id || '',
      });
      return NextResponse.json({ ok: true, status: 'paid', captureId: capture?.id || '' });
    }

    await updateOrder(reference, {
      status: status === 'DECLINED' ? 'declined' : 'error',
      paymentMethod: 'paypal',
    });
    return NextResponse.json({ ok: false, status: (status || 'error').toLowerCase() }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error capturando el pago' }, { status: 500 });
  }
}
