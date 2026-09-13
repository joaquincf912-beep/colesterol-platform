'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Check, MessageCircle, Home, Package } from 'lucide-react';

export default function PagoConfirmadoPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('ref') || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center px-5 py-10">
      <div className="max-w-md w-full text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-3">Pago exitoso</h1>
        <p className="text-gray-500 mb-2">
          Tu libro personalizado esta en produccion. Te contactaremos por WhatsApp con los detalles.
        </p>

        {reference && (
          <div className="bg-white rounded-2xl border-2 border-pink-100 p-5 my-6">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-1">Referencia de pago</p>
            <p className="text-sm font-black text-gray-800 break-all">{reference}</p>
          </div>
        )}

        <div className="space-y-3">
          <a
            href="https://wa.me/573026456024?text=Hola,%20acabo%20de%20pagar%20mi%20libro%20personalizado.%20Mi%20referencia%20es:"
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
    </div>
  );
}
