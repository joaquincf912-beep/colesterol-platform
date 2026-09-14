import { NextResponse } from 'next/server';
import { orderStore, BookOrder } from '@/lib/book-orders-store';

// PayPal payment checkout API.
// Env vars needed in Vercel:
//   PAYPAL_CLIENT_ID      -> PayPal app client id
//   PAYPAL_CLIENT_SECRET  -> PayPal app secret
// Optional:
//   PAYPAL_API_BASE       -> defaults to https://api-m.paypal.com (live).
//                            Set to https://api-m.sandbox.paypal.com for testing.

const USD_PRICES: Record<string, number> = {
  superheroe: 19.99,
  princesa: 19.99,
  espacio: 22.99,
  bosque: 19.99,
  colores: 14.99,
  receta: 19.99,
};

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

export async function POST(req: Request) {
  try {
    const { bookId, bookTitle, childName, features, customerEmail } = await req.json();

    const amount = USD_PRICES[bookId];
    if (!bookId || !amount) {
      return NextResponse.json({ error: 'Datos de pago invalidos' }, { status: 400 });
    }

    const apiBase = process.env.PAYPAL_API_BASE || 'https://api-m.paypal.com';
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    // Unique payment reference (used by every flow)
    const reference = `LIB-${String(bookId).toUpperCase()}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    if (!clientId || !clientSecret) {
      // PayPal keys incomplete on the server: register the order and let the
      // client continue with the WhatsApp confirmation flow instead of failing.
      const pendingRecord: BookOrder = {
        reference,
        status: 'pending',
        bookId,
        bookTitle: bookTitle || bookId,
        childName: childName || '',
        features: features || [],
        amountInCents: Math.round(amount * 100),
        customerEmail: customerEmail || '',
        paymentMethod: 'whatsapp',
        updatedAt: new Date().toISOString(),
      };
      orderStore().set(reference, pendingRecord);
      return NextResponse.json({
        gateway: 'whatsapp',
        reference,
        amount,
        currency: 'USD',
      });
    }

    const accessToken = await getAccessToken(apiBase);
    if (!accessToken) {
      return NextResponse.json({ error: 'Error autenticando con PayPal' }, { status: 500 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'https://app.traccionweb.com';

    // Create a PayPal order (amount = book price in USD)
    const orderRes = await fetch(`${apiBase}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: reference,
            custom_id: reference,
            description: `Libro personalizado: ${bookTitle || bookId}${childName ? ` (${childName})` : ''}`.slice(0, 127),
            amount: { currency_code: 'USD', value: amount.toFixed(2) },
          },
        ],
        application_context: {
          brand_name: 'TraccionWeb Libros',
          locale: 'es-CO',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
          return_url: `${origin}/libros/pago-confirmado?ref=${reference}`,
          cancel_url: `${origin}/libros/${bookId}?pago=cancelado`,
        },
      }),
      cache: 'no-store',
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      return NextResponse.json(
        { error: orderData?.message || 'Error creando la orden de PayPal' },
        { status: 500 }
      );
    }

    // Register the order as pending (confirm route will capture and update it)
    const orderRecord: BookOrder = {
      reference,
      status: 'pending',
      bookId,
      bookTitle: bookTitle || bookId,
      childName: childName || '',
      features: features || [],
      amountInCents: Math.round(amount * 100),
      customerEmail: customerEmail || '',
      paymentMethod: 'paypal',
      paypalOrderId: orderData.id,
      updatedAt: new Date().toISOString(),
    };

    // Persist to Supabase when configured; memory store always keeps a copy
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && serviceKey) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, serviceKey);
        await supabase.from('book_orders').upsert(orderRecord, { onConflict: 'reference' });
      } catch {
        // ignore; memory store still registers it
      }
    }

    orderStore().set(reference, orderRecord);

    const approvalLink = (orderData.links || []).find(
      (l: { rel: string; href: string }) => l.rel === 'approve' || l.rel === 'payer-action'
    );

    return NextResponse.json({
      gateway: 'paypal',
      orderId: orderData.id,
      reference,
      approveUrl: approvalLink?.href || '',
      amount,
      currency: 'USD',
    });
  } catch {
    return NextResponse.json({ error: 'Error generando el pago' }, { status: 500 });
  }
}
