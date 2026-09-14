'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Check, Star, BookOpen, Palette, Gift, Globe, CreditCard, Loader2, Banknote, Copy } from 'lucide-react';

const BOOKS = [
  {
    id: 'superheroe',
    title: 'El Superheroe de [Nombre]',
    shortTitle: 'El Superheroe',
    description: 'Tu niño/a es el protagonista de su propia aventura de superheroe. Incluye su nombre, apariencia y poderes especiales.',
    longDescription: 'Imagina a tu hijo/a volando sobre la ciudad con una capa roja brillante, rescatando a sus amigos y superando obstaculos con sus poderes especiales. Este libro personalizado convierte a tu niño/a en el superheroe mas valiente del universo. Con ilustraciones coloridas y una historia emocionante, cada pagina es una aventura unica.',
    cover: '/covers/superheroe.jpg',
    price: '$19.99',
    color: 'from-blue-500 via-indigo-500 to-purple-600',
    pages: '24 páginas',
    features: ['Nombre personalizado', 'Color de capa a elegir', 'Superpoderes unicos', 'Ciudad personalizada'],
  },
  {
    id: 'princesa',
    title: 'Mi Princesa Favorita',
    shortTitle: 'Mi Princesa',
    description: 'Una historia magica donde tu hija es la princesa mas valiente del reino. Con dragones, castillos y mucho amor.',
    longDescription: 'Tu hija se convierte en la princesa mas valiente del reino, enfrentando dragones amigables, explorando castillos encantados y haciendo amigos en el bosque magico. Con ilustraciones deslumbrantes y una historia de valentia, este libro celebrara la fortaleza y la imaginacion de tu pequeña.',
    cover: '/covers/princesa.jpg',
    price: '$19.99',
    color: 'from-pink-400 via-rose-500 to-fuchsia-600',
    pages: '24 páginas',
    features: ['Nombre de la princesa', 'Color del vestido', 'Animal magico favorito', 'Castillo personalizado'],
  },
  {
    id: 'espacio',
    title: 'Aventura en el Espacio',
    shortTitle: 'Aventura Espacio',
    description: 'Tu hijo/a viaja a la luna y mas alla en esta emocionante aventura espacial. Con planetas, cohetes y aliens amigables.',
    longDescription: 'Un viaje épico al espacio donde tu niño/a explora la luna, visita planetas lejanos y hace amigos alienigenas adorables. Con un cohete personalizado y un traje espacial a medida, esta aventura estimula la curiosidad y el amor por la ciencia.',
    cover: '/covers/espacio.jpg',
    price: '$22.99',
    color: 'from-indigo-400 via-blue-500 to-cyan-600',
    pages: '28 páginas',
    features: ['Nombre del astronauta', 'Color del cohete', 'Planeta favorito', 'Alien amigo personalizado'],
  },
  {
    id: 'bosque',
    title: 'El Bosque Encantado',
    shortTitle: 'El Bosque',
    description: 'Una aventura en la naturaleza donde tu niño/a hace amigos con todos los animales del bosque.',
    longDescription: 'Tu niño/a se adentra en un bosque magico lleno de luciernagas, donde hace amigos con osos simpaticos, conejos curiosos y búhos sabios. Aprende sobre la naturaleza mientras vive una aventura inolvidable en cada pagina.',
    cover: '/covers/bosque.jpg',
    price: '$19.99',
    color: 'from-green-400 via-emerald-500 to-teal-600',
    pages: '24 páginas',
    features: ['Nombre del explorador', 'Animal favorito', 'Estación del año', 'Arbol magico personalizado'],
  },
  {
    id: 'colores',
    title: 'Mi Primer Libro de Colores',
    shortTitle: 'Libro de Colores',
    description: 'Libro interactivo para los mas pequeños. Aprende colores con imagenes brillantes y texturas suaves.',
    longDescription: 'Un libro sensorial y visual diseñado para los mas pequeños de la casa. Cada pagina presenta un color diferente con animales adorables, texturas tactiles y elementos interactivos. Perfecto para estimular el desarrollo visual y cognitivo desde los primeros meses.',
    cover: '/covers/colores.jpg',
    price: '$14.99',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    pages: '16 páginas',
    features: ['Texto suave al tacto', 'Animales por color', 'Ilustraciones brillantes', 'Ideal 0-3 años'],
  },
  {
    id: 'receta',
    title: 'La Receta Magica',
    shortTitle: 'La Receta',
    description: 'Tu niño/a es el chef estrella en esta aventura culinaria. Aprende sobre comida saludable mientras se divierte.',
    longDescription: 'Tu niño/a se convierte en el chef mas famoso del mundo, creando recetas magicas que danzan en el aire. Con ingredientes coloridos y recetas divertidas, este libro inspira el amor por la cocina y la comida saludable mientras se divierte con cada pagina.',
    cover: '/covers/receta.jpg',
    price: '$19.99',
    color: 'from-red-400 via-pink-500 to-rose-500',
    pages: '24 páginas',
    features: ['Nombre del chef', 'Receta personalizada', 'Color del delantal', 'Ingrediente magico favorito'],
  },
];

export default function BookDetailPage({ params }: { params: { id: string } }) {
  const book = BOOKS.find(b => b.id === params.id);
  const [childName, setChildName] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showManualPay, setShowManualPay] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-gray-800 mb-4">Libro no encontrado</h1>
          <Link href="/libros" className="text-pink-500 font-bold hover:underline">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev =>
      prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]
    );
  };

  const handleCardPayment = async () => {
    setPaymentError('');
    setProcessingPayment(true);
    try {
      // Price in USD -> COP cents (approx rate 4000 COP/USD)
      const usdAmount = parseFloat(book.price.replace('$', ''));
      const amountInCents = Math.round(usdAmount * 4000 * 100);

      const res = await fetch('/api/wompi/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          bookTitle: book.title,
          childName,
          features: selectedFeatures,
          amountInCents,
          customerEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Error procesando el pago');
      }

      // Gateway not configured on the server: continue with WhatsApp confirmation
      if (data.gateway === 'whatsapp') {
        const parts = [
          `Hola! Quiero comprar el libro "${book.title}"`,
          childName ? `para ${childName}` : '',
          `Referencia: ${data.reference}`,
          `Total: ${book.price}`,
          selectedFeatures.length ? `Personalizacion: ${selectedFeatures.join(', ')}` : '',
          'Tengo los datos listos para coordinar el pago.',
        ].filter(Boolean);
        window.open(`https://wa.me/573026456024?text=${encodeURIComponent(parts.join('. '))}`, '_blank');
        setProcessingPayment(false);
        return;
      }

      // Build Wompi Web Checkout form and submit
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://checkout.wompi.co/p/';

      const fields: Record<string, string> = {
        'public-key': data.publicKey,
        'currency': data.currency,
        'amount-in-cents': String(data.amountInCents),
        'reference': data.reference,
        'signature:integrity': data.signature,
        'redirect-url': data.redirectUrl,
        'customer-data:email': data.customerEmail,
        'customer-data:full-name': childName ? `Pedido de ${childName}` : 'Libro Personalizado',
        'customer-data:phone-number': '+573000000000',
        'customer-data:legal-id': '000000000',
      };

      Object.entries(fields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'Error procesando el pago');
      setProcessingPayment(false);
    }
  };

  const personalizedText = childName
    ? `Hola! Quiero personalizar el libro "${book.title}" para ${childName}. Caracteristicas: ${selectedFeatures.join(', ') || 'Ninguna especifica'}. Precio: ${book.price}`
    : `Hola! Quiero personalizar el libro "${book.title}". Precio: ${book.price}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-yellow-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-4xl mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/libros" className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors font-bold">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </Link>
          <span className="text-sm font-bold text-pink-500 bg-pink-100 px-3 py-1 rounded-full">{book.price}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Cover Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-pink-300/30 border-4 border-white">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full aspect-[3/4] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-gray-900 px-4 py-2 rounded-2xl font-black text-sm shadow-lg rotate-3">
                {book.pages}
              </div>
            </div>
          </div>

          {/* Info & Personalization */}
          <div className="space-y-8">
            {/* Title & Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
                {book.title}
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed">{book.longDescription}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">Que incluye</h3>
              <div className="grid grid-cols-2 gap-3">
                {book.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-xl px-4 py-3 border border-pink-100">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="bg-white rounded-2xl p-6 border-2 border-pink-200 shadow-lg shadow-pink-100/40">
              <h3 className="text-lg font-black text-gray-800 mb-2">Personaliza tu libro</h3>
              <p className="text-sm text-gray-500 mb-4">Escribe el nombre de tu niño/a para la portada</p>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Ej: Sofia, Mateo, Valentina..."
                className="w-full px-5 py-3.5 rounded-xl border-2 border-pink-200 focus:border-pink-400 focus:outline-none text-lg font-bold text-gray-800 placeholder:text-gray-300 transition-colors bg-pink-50/50"
              />
              {childName && (
                <div className="mt-3 flex items-center gap-2 text-green-600 text-sm font-bold">
                  <Check className="w-4 h-4" />
                  Se personalizara con el nombre: {childName}
                </div>
              )}
            </div>

            {/* Select customization options */}
            <div className="bg-white rounded-2xl p-6 border-2 border-purple-200 shadow-lg shadow-purple-100/40">
              <h3 className="text-lg font-black text-gray-800 mb-2">Elige opciones</h3>
              <p className="text-sm text-gray-500 mb-4">Selecciona lo que quieres personalizar</p>
              <div className="flex flex-wrap gap-2">
                {book.features.map((feature, i) => (
                  <button
                    key={i}
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all border-2 ${
                      selectedFeatures.includes(feature)
                        ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-400/30'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300'
                    }`}
                  >
                    {selectedFeatures.includes(feature) && <Check className="w-3 h-3 inline mr-1" />}
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Price & CTA */}
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl shadow-pink-300/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-white/80 font-medium">Precio total</p>
                  <p className="text-3xl font-black">{book.price}</p>
                </div>
              </div>

              {/* Email for payment receipt */}
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Tu email para el recibo de pago"
                className="w-full px-4 py-3 rounded-xl border-2 border-white/30 bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 text-sm font-medium mb-4 transition-colors"
              />

              {/* Card payment button */}
              <button
                onClick={handleCardPayment}
                disabled={processingPayment}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 py-4 rounded-xl font-black text-lg hover:bg-gray-50 transition-all active:scale-95 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mb-3"
              >
                {processingPayment ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-6 h-6" />
                    Pagar con tarjeta / Nequi
                  </>
                )}
              </button>

              {paymentError && (
                <div className="bg-red-500/20 border border-red-300/40 text-white text-sm font-bold px-4 py-3 rounded-xl mb-3">
                  {paymentError}
                </div>
              )}

              <div className="flex items-center gap-3 my-3">
                <div className="flex-1 h-px bg-white/30" />
                <span className="text-xs text-white/70 font-bold uppercase">o</span>
                <div className="flex-1 h-px bg-white/30" />
              </div>

              {/* Manual payments accordion */}
              <button
                onClick={() => setShowManualPay(!showManualPay)}
                className="w-full flex items-center justify-center gap-2 text-white/90 text-sm font-bold py-2 hover:text-white transition-colors"
              >
                <Banknote className="w-4 h-4" />
                Pagar con transferencia o Pago Móvil
              </button>
              {showManualPay && (
                <div className="bg-white/10 border border-white/25 rounded-xl p-4 mt-2 mb-3 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-white/60 font-black uppercase tracking-wide">Bancolombia · Ahorros</p>
                      <p className="text-sm font-black text-white">321-000000-00</p>
                    </div>
                    <button onClick={() => copyToClipboard('321-000000-00')} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors" aria-label="Copiar cuenta">
                      {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] text-white/60 font-black uppercase tracking-wide">Nequi</p>
                      <p className="text-sm font-black text-white">301 000 0000</p>
                    </div>
                    <button onClick={() => copyToClipboard('3010000000')} className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors" aria-label="Copiar Nequi">
                      {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-white/70 font-medium">Envía el comprobante por WhatsApp para confirmar tu pedido.</p>
                </div>
              )}

              <a
                href={`https://wa.me/573026456024?text=${encodeURIComponent(personalizedText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-white text-pink-600 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
              >
                <MessageCircle className="w-6 h-6" />
                Ordenar por WhatsApp
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-1 text-sm">
                <Globe className="w-4 h-4" />
                <span>Envíos a todo el mundo</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Alta calidad</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Gift className="w-4 h-4" />
                <span>Regalo perfecto</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-pink-100 px-4 py-3 flex items-center justify-between gap-3 shadow-[0_-4px_20px_rgba(236,72,153,0.15)]">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Precio total</p>
          <p className="text-xl font-black text-gray-900 leading-none">{book.price}</p>
        </div>
        <a
          href={`https://wa.me/573026456024?text=${encodeURIComponent(personalizedText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] text-white font-black text-sm shadow-lg shadow-green-500/30 active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          Ordenar ahora
        </a>
      </div>

    </div>
  );
}
