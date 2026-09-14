'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, MessageCircle, Home, Package, Loader2, XCircle } from 'lucide-react';

function ConfirmacionContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') || '';
  const paypalToken = searchParams.get('token') || ''; // PayPal order id

  const [captureState, setCaptureState] = useState<'processing' | 'paid' | 'failed'>('processing');
  const [captureId, setCaptureId] = useState('');

  useEffect(() => {
    if (!paypalToken || !reference) {
      setCaptureState(reference ? 'processing' : 'failed');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/paypal/capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: paypalToken, reference }),
        });
        const data = await res.json();
        if (!cancelled) {
          if (data.ok) {
            setCaptureId(data.captureId || '');
            setCaptureState('paid');
          } else {
            setCaptureState('failed');
          }
        }
      } catch {
        if (!cancelled) setCaptureState('failed');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paypalToken, reference]);

  if (captureState === 'processing') {
    return (
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Loader2 className="w-12 h-12 text-pink-500 animate-spin" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Confirmando tu pago...</h1>
        <p className="text-gray-500 mb-2">Estamos validando tu pago con PayPal. No cierres esta pantalla.</p>
        {reference && (
          <div className="bg-white rounded-2xl border-2 border-pink-100 p-5 my-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Referencia de pedido</p>
            <p className="text-sm font-black text-gray-800 break-all">{reference}</p>
          </div>
        )}
      </div>
    );
  }

  if (captureState === 'failed') {
    return (
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Pago no completado</h1>
        <p className="text-gray-500 mb-2">
          No pudimos confirmar tu pago de PayPal. Si crees que fue un error, escribenos por WhatsApp con tu referencia.
        </p>
        {reference && (
          <div className="bg-white rounded-2xl border-2 border-pink-100 p-5 my-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Referencia de pedido</p>
            <p className="text-sm font-black text-gray-800 break-all">{reference}</p>
          </div>
        )}
        <div className="space-y-3 mt-6">
          <a
            href={`https://wa.me/573026456024?text=${encodeURIComponent(`Hola, tengo una duda con mi pago de PayPal. Mi referencia es: ${reference}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-black hover:bg-[#20bd5a] transition-all active:scale-95 shadow-lg shadow-green-500/30"
          >
            <MessageCircle className="w-5 h-5" />
            Escríbenos por WhatsApp
          </a>
          <Link
            href="/libros"
            className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 rounded-xl font-black hover:bg-gray-200 transition-all active:scale-95"
          >
            <Home className="w-5 h-5" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
        <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-3">Pago exitoso</h1>
      <p className="text-gray-500 mb-2">
        Tu libro personalizado esta en produccion. Te contactaremos por WhatsApp con los detalles.
      </p>

      <div className="bg-white rounded-2xl border-2 border-pink-100 p-5 my-6 space-y-3">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Referencia de pedido</p>
          <p className="text-sm font-black text-gray-800 break-all">{reference}</p>
        </div>
        {captureId && (
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Pago PayPal</p>
            <p className="text-sm font-black text-gray-800 break-all">{captureId}</p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <a
          href={`https://wa.me/573026456024?text=${encodeURIComponent(`Hola, acabo de pagar mi libro personalizado con PayPal. Mi referencia es: ${reference}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-black hover:bg-[#20bd5a] transition-all active:scale-95 shadow-lg shadow-green-500/30"
        >
          <MessageCircle className="w-5 h-5" />
          Confirmar por WhatsApp
        </a>
        <Link
          href="/libros"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-4 rounded-xl font-black hover:bg-gray-200 transition-all active:scale-95"
        >
          <Home className="w-5 h-5" />
          Volver a la tienda
        </Link>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
        <Package className="w-4 h-4" />
        <span>Envío a todo el mundo en 5-10 días hábiles</span>
      </div>
    </div>
  );
}

export default function PagoConfirmadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center px-5 py-10">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        }
      >
        <ConfirmacionContent />
      </Suspense>
    </div>
  );
}
