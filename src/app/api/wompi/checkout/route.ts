import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { orderStore, BookOrder } from '@/lib/book-orders-store';

// Payment checkout API — gateway agnostic.
// Reads whatever keys are configured on the server (Wompi / Stripe / Mercado Pago ...)
// and always returns enough data for the client to start a payment or fall back gracefully.

export async function POST(req: Request) {
  try {
    const { bookId, bookTitle, childName, features, amountInCents, customerEmail } = await req.json();

    if (!bookId || !amountInCents || amountInCents < 100) {
      return NextResponse.json({ error: 'Datos de pago invalidos' }, { status: 400 });
    }

    // Unique payment reference
    const reference = `LIB-${String(bookId).toUpperCase()}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;

    // Register the order as pending (webhook/gateway will update it)
    const orderRecord: BookOrder = {
      reference,
      status: 'pending',
      bookId,
      bookTitle,
      childName: childName || '',
      features: features || [],
      amountInCents,
      customerEmail: customerEmail || '',
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

    // Detect configured gateway by its environment keys
    const wompiPublicKey = process.env.WOMPI_PUBLIC_KEY;
    const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (wompiPublicKey && wompiIntegritySecret) {
      const concat = `${reference}${amountInCents}COP${wompiIntegritySecret}`;
      const signature = crypto.createHash('sha256').update(concat).digest('hex');

      return NextResponse.json({
        gateway: 'wompi',
        publicKey: wompiPublicKey,
        reference,
        signature,
        amountInCents,
        currency: 'COP',
        customerEmail: customerEmail || 'cliente@traccionweb.com',
        redirectUrl: `https://app.traccionweb.com/libros/pago-confirmado?ref=${reference}`,
        metadata: {
          bookId,
          bookTitle,
          childName: childName || '',
          features: features || [],
        },
      });
    }

    // No payment gateway keys on the server: still register the order and
    // let the client continue with the WhatsApp confirmation flow.
    return NextResponse.json({
      gateway: 'whatsapp',
      reference,
      amountInCents,
      currency: 'COP',
      metadata: {
        bookId,
        bookTitle,
        childName: childName || '',
        features: features || [],
      },
    });
  } catch {
    return NextResponse.json({ error: 'Error generando el pago' }, { status: 500 });
  }
}
