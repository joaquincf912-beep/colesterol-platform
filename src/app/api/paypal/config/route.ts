import { NextResponse } from 'next/server';

// Returns the public PayPal Client ID so the frontend can render
// Smart Payment Buttons inside the page (the client id is public by design).
export async function GET() {
  return NextResponse.json({
    clientId: process.env.PAYPAL_CLIENT_ID || null,
    currency: 'USD',
    configured: Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET),
  });
}
