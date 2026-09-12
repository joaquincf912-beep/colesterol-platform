'use client';

import {
  BookOpen, Heart, Star, Sparkles, Check, ArrowRight,
  MessageCircle, Gift, Palette, Puzzle, Crown, Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BOOKS = [
  {
    title: 'El Superheroe de [Nombre]',
    description: 'Tu nino/a es el protagonista de su propia aventura de superheroe. Incluye su nombre, apariencia y poderes especiales.',
    cover: 'https://images.unsplash.com/photo-1629236714692-9ad8b7ae89e2?w=400&h=560&fit=crop',
    price: '$19.99',
    color: 'from-blue-500 to-purple-600',
    pages: '24 paginas',
  },
  {
    title: 'Mi Princess Favorita',
    description: 'Una historia magica donde tu hija es la princesa mas valiente del reino. Con dragones, castillos y mucho amor.',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=560&fit=crop',
    price: '$19.99',
    color: 'from-pink-500 to-rose-500',
    pages: '24 paginas',
  },
  {
    title: 'Aventura en el Espacio',
    description: 'Tu hijo/a viaja a la luna y mas alla en esta emocionante aventura espacial. Con planetas, cohetes y aliens amigables.',
    cover: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=560&fit=crop',
    price: '$22.99',
    color: 'from-indigo-500 to-blue-600',
    pages: '28 paginas',
  },
  {
    title: 'El Bosque de los Animales',
    description: 'Una aventura en la naturaleza donde tu nino/a hace amigos con todos los animales del bosque.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=560&fit=crop',
    price: '$19.99',
    color: 'from-green-500 to-emerald-600',
    pages: '24 paginas',
  },
  {
    title: 'Mi Primer Libro de Colores',
    description: 'Libro interactivo para los mas pequenos. Aprende colores con imagenes brillantes y texturas suaves.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=560&fit=crop',
    price: '$14.99',
    color: 'from-yellow-400 to-orange-500',
    pages: '16 paginas',
  },
  {
    title: 'La Receta Magica',
    description: 'Tu nino/a es el chef estrella en esta aventura culinaria. Aprende sobre comida saludable mientras se divierte.',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=560&fit=crop',
    price: '$19.99',
    color: 'from-red-400 to-pink-500',
    pages: '24 paginas',
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Historias Unicas',
    description: 'Cada libro es escrito especialmente para tu hijo/a. Nombre, apariencia y aventuras personalizadas.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Palette,
    title: 'Colores Brillantes',
    description: 'Ilustraciones vibrantes y llamativas que capturan la atencion de los mas pequenos.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
  {
    icon: Heart,
    title: 'Materiales Seguros',
    description: 'Papel de alta calidad, tinta no toxica y encuadernacion duradera para que dure toda la vida.',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Gift,
    title: 'Regalo Perfecto',
    description: 'El regalo mas especial para cumpleaños, Navidad o cualquier ocasion. Sorprende a los peques.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
  {
    icon: Globe,
    title: 'Envio Mundial',
    description: 'Enviamos a cualquier parte del mundo. Tu libro llega a tu puerta en 7-14 dias.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Sparkles,
    title: 'Personalizacion Total',
    description: 'Elige nombre, color de pelo, ojos, ropa y hasta el tipo de aventura que quieras.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
];

const STATS = [
  { value: '10K+', label: 'Libros vendidos' },
  { value: '98%', label: 'Clientes felices' },
  { value: '50+', label: 'Paises alcanzados' },
  { value: '4.9', label: 'Calificacion promedio' },
];

const PLANS = [
  {
    name: 'Basico',
    subtitle: 'Primera Aventura',
    description: 'Perfecto para conocer nuestros libros personalizados.',
    price: '$19.99',
    period: 'por libro',
    features: [
      '1 libro personalizado (24 paginas)',
      'Nombre y apariencia del nino/a',
      'Portada con foto ilustrada',
      'Envio estandar incluido',
      '1 revision de contenido',
    ],
    highlighted: false,
  },
  {
    name: 'Familiar',
    subtitle: 'Paquete Completo',
    description: 'Para familias que quieren mas historias para sus hijos.',
    price: '$49.99',
    period: '3 libros',
    features: [
      '3 libros personalizados (24 paginas c/u)',
      'Nombre y apariencia de cada nino',
      '3 portadas diferentes',
      'Envio express incluido',
      '2 revisiones por libro',
      'Marcador personalizado gratis',
    ],
    highlighted: true,
  },
  {
    name: 'Coleccion',
    subtitle: 'Edicion Especial',
    description: 'Para regalos especiales y coleccionistas.',
    price: '$89.99',
    period: '5 libros',
    features: [
      '5 libros personalizados (28 paginas c/u)',
      'Personalizacion avanzada',
      'Portadas premium con relieve',
      'Envio express + caja regalo',
      'Revisiones ilimitadas',
      'Certificado de autenticidad',
      'Acceso a version digital',
    ],
    highlighted: false,
  },
];

export default function LibrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-yellow-50 to-blue-50 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-pink-200/50" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-800">Libros Magicos</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-pink-500 transition-colors">Servicios</a>
            <a href="#books" className="hover:text-pink-500 transition-colors">Libros</a>
            <a href="#pricing" className="hover:text-pink-500 transition-colors">Precios</a>
          </div>
          <a
            href="https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20libros%20personalizados%20para%20ninos"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/25"
          >
            Contactar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-40 h-40 bg-pink-300/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/2 w-48 h-48 bg-blue-300/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 border border-pink-200 text-pink-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Historias que enamoran
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6 text-gray-800">
            Libros personalizados
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">para los mas pequeños</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Creamos historias unicas donde tu hijo/a es el protagonista.
            Regalos memorables que duran toda la vida. Envio a todo el mundo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#books"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold text-sm hover:from-pink-600 hover:to-purple-600 transition-all active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-pink-500/25"
            >
              Ver Libros <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-white text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
            >
              Ver Precios
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/80 border border-pink-100 rounded-2xl p-4 text-center shadow-sm">
                <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-[11px] text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-medium mb-3">Por que elegirnos</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Caracteristicas</h2>
            <p className="text-sm text-gray-400 mt-3 max-w-lg mx-auto">
              Libros personalizados de alta calidad para los mas pequenos de la casa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-pink-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-pink-100 transition-all group"
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', feature.bgColor)}>
                  <feature.icon className={cn('w-6 h-6', feature.color)} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">{feature.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Gallery */}
      <section id="books" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-medium mb-3">Nuestros Libros</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Ejemplos de Libros</h2>
            <p className="text-sm text-gray-400 mt-3 max-w-lg mx-auto">
              Cada libro es una aventura unica. Elige la que mas le guste a tu hijo/a.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOOKS.map((book, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 hover:shadow-xl hover:shadow-pink-200/50 transition-all group border border-pink-100"
              >
                <div className={cn('relative aspect-[3/4] bg-gradient-to-br', book.color, 'flex items-center justify-center p-6')}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative z-10 text-center">
                    <BookOpen className="w-16 h-16 text-white/80 mx-auto mb-4" />
                    <h3 className="text-xl font-black text-white leading-tight">{book.title}</h3>
                    <p className="text-sm text-white/80 mt-2">{book.pages}</p>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full">
                    <span className="text-sm font-bold text-gray-800">{book.price}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">{book.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">{book.description}</p>
                  <a
                    href={`https://wa.me/573026456024?text=Hola,%20quiero%20personalizar%20el%20libro%20"${book.title}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold hover:from-pink-600 hover:to-purple-600 transition-all shadow-md shadow-pink-500/20"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Personalizar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-5 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-medium mb-3">Proceso</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Como funciona</h2>
            <p className="text-sm text-gray-400 mt-3">En 3 pasos simples tienes el libro perfecto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Elige tu libro', desc: 'Selecciona la aventura que mas le guste a tu nino/a y personaliza los detalles.', icon: BookOpen },
              { step: '02', title: 'Personalizalo', desc: 'Agrega el nombre, apariencia y cualquier detalle especial que quieras.', icon: Palette },
              { step: '03', title: 'Recibelo en casa', desc: 'Enviamos el libro a tu puerta en 7-14 dias. Listo para leer y disfrutar.', icon: Gift },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-100 to-purple-100 border border-pink-200 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-100/50">
                  <item.icon className="w-8 h-8 text-pink-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-medium mb-3">Precios</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Planes de Libros</h2>
            <p className="text-sm text-gray-400 mt-3">Regalos especiales a precios accesibles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-3xl border transition-all overflow-hidden',
                  plan.highlighted
                    ? 'bg-gradient-to-b from-pink-50 to-purple-50 border-pink-200 shadow-xl shadow-pink-200/30'
                    : 'bg-white border-gray-200 shadow-sm'
                )}
              >
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[10px] font-medium m-6 mb-0">
                    <Star className="w-3 h-3" /> Mas Vendido
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-[10px] text-pink-500 font-medium uppercase tracking-wider mt-1">{plan.subtitle}</p>
                  <p className="text-xs text-gray-400 mt-2">{plan.description}</p>

                  <div className="mt-4 mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-800">{plan.price}</span>
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-200 mb-4" />

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-gray-500">
                        <Check className={cn('w-3.5 h-3.5 flex-shrink-0', plan.highlighted ? 'text-pink-500' : 'text-gray-300')} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}%20de%20libros%20personalizados`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full py-3 rounded-2xl text-center text-sm font-semibold transition-all',
                      plan.highlighted
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 shadow-lg shadow-pink-500/25'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                    )}
                  >
                    Ordenar Ahora
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Regala una aventura
            <br />
            <span className="text-yellow-300">que nunca olvidaran</span>
          </h2>
          <p className="text-sm text-white/80 mb-8 max-w-lg mx-auto">
            Libros personalizados para los mas pequenos. Sorprende a tu nino/a con una historia unica.
          </p>
          <a
            href="https://wa.me/573026456024?text=Hola,%20quiero%20crear%20un%20libro%20personalizado%20para%20mi%20hijo/a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-pink-600 font-semibold text-sm hover:bg-gray-50 transition-all active:scale-[0.98] shadow-xl shadow-black/10"
          >
            <MessageCircle className="w-4 h-4" />
            Crear Mi Libro
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-gray-400">Libros Magicos - TraccionWeb</span>
          </div>
          <p className="text-[10px] text-gray-500">Desarrollado por TraccionWeb</p>
        </div>
      </footer>
    </div>
  );
}
