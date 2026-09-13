import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { orderStore, BookOrder } from '@/lib/book-orders-store';

// Wompi payment checkout API
// Generates the integrity signature server-side (never expose the secret in frontend)
// Env vars needed in Vercel:
//   WOMPI_PUBLIC_KEY       -> pub_prod_xxx or pub_test_xxx
//   WOMPI_INTEGRITY_SECRET -> prod_integrity_xxx or test_integrity_xxx

export async function POST(req: Request) {
  try {
    const { bookId, bookTitle, childName, features, amountInCents, customerEmail } = await req.json();

    if (!bookId || !amountInCents || amountInCents < 100) {
      return NextResponse.json({ error: 'Datos de pago invalidos' }, { status: 400 });
    }

    const publicKey = process.env.WOMPI_PUBLIC_KEY;
    const integritySecret = process.env.WOMPI_INTEGRITY_SECRET;

    if (!publicKey || !integritySecret) {
      return NextResponse.json(
        { error: 'Pasarela de pago no configurada. Falta WOMPI_PUBLIC_KEY o WOMPI_INTEGRITY_SECRET en el servidor.' },
        { status: 500 }
      );
    }

    // Unique payment reference
    const reference = `LIB-${bookId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Integrity signature: SHA256(reference + amountInCents + currency + secret)
    const concat = `${reference}${amountInCents}COP${integritySecret}`;
    const signature = crypto.createHash('sha256').update(concat).digest('hex');

    // Register the order as pending (webhook will update it to paid/declined)
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

    return NextResponse.json({
      publicKey,
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
  } catch {
    return NextResponse.json({ error: 'Error generando el pago' }, { status: 500 });
  }
}
