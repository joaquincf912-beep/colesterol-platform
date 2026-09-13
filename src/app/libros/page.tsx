'use client';

import Link from 'next/link';
import {
  BookOpen, Heart, Star, Sparkles, Check, ArrowRight,
  MessageCircle, Gift, Palette, Globe, Cloud, Sun,
  Moon, TreePine, Fish, Cat, Dog, Rainbow, Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BOOKS = [
  {
    id: 'superheroe',
    title: 'El Superheroe de [Nombre]',
    description: 'Tu niño/a es el protagonista de su propia aventura de superheroe. Incluye su nombre, apariencia y poderes especiales.',
    cover: '/covers/superheroe.jpg',
    price: '$19.99',
    color: 'from-blue-400 via-indigo-500 to-purple-600',
    pages: '24 páginas',
    icon: Star,
  },
  {
    id: 'princesa',
    title: 'Mi Princesa Favorita',
    description: 'Una historia magica donde tu hija es la princesa mas valiente del reino. Con dragones, castillos y mucho amor.',
    cover: '/covers/princesa.jpg',
    price: '$19.99',
    color: 'from-pink-400 via-rose-500 to-fuchsia-600',
    pages: '24 páginas',
    icon: Crown,
  },
  {
    id: 'espacio',
    title: 'Aventura en el Espacio',
    description: 'Tu hijo/a viaja a la luna y mas alla en esta emocionante aventura espacial. Con planetas, cohetes y aliens amigables.',
    cover: '/covers/espacio.jpg',
    price: '$22.99',
    color: 'from-indigo-400 via-blue-500 to-cyan-600',
    pages: '28 páginas',
    icon: Moon,
  },
  {
    id: 'bosque',
    title: 'El Bosque Encantado',
    description: 'Una aventura en la naturaleza donde tu niño/a hace amigos con todos los animales del bosque.',
    cover: '/covers/bosque.jpg',
    price: '$19.99',
    color: 'from-green-400 via-emerald-500 to-teal-600',
    pages: '24 páginas',
    icon: TreePine,
  },
  {
    id: 'colores',
    title: 'Mi Primer Libro de Colores',
    description: 'Libro interactivo para los mas pequeños. Aprende colores con imagenes brillantes y texturas suaves.',
    cover: '/covers/colores.jpg',
    price: '$14.99',
    color: 'from-yellow-400 via-orange-500 to-red-500',
    pages: '16 páginas',
    icon: Rainbow,
  },
  {
    id: 'receta',
    title: 'La Receta Magica',
    description: 'Tu niño/a es el chef estrella en esta aventura culinaria. Aprende sobre comida saludable mientras se divierte.',
    cover: '/covers/receta.jpg',
    price: '$19.99',
    color: 'from-red-400 via-pink-500 to-rose-500',
    pages: '24 páginas',
    icon: Heart,
  },
];

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Historias Unicas',
    description: 'Cada libro es escrito especialmente para tu hijo/a. Nombre, apariencia y aventuras personalizadas.',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
  },
  {
    icon: Palette,
    title: 'Colores Brillantes',
    description: 'Ilustraciones vibrantes y llamativas que capturan la atención de los mas pequeños.',
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
    borderColor: 'border-pink-200',
  },
  {
    icon: Heart,
    title: 'Materiales Seguros',
    description: 'Papel de alta calidad, tinta no toxica y encuadernacion duradera para que dure toda la vida.',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
  },
  {
    icon: Gift,
    title: 'Regalo Perfecto',
    description: 'El regalo mas especial para cumpleaños, Navidad o cualquier ocasión. Sorprende a los peques.',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-200',
  },
  {
    icon: Globe,
    title: 'Envio Mundial',
    description: 'Enviamos a cualquier parte del mundo. Tu libro llega a tu puerta en 7-14 dias.',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
  },
  {
    icon: Sparkles,
    title: 'Personalizacion Total',
    description: 'Elige nombre, color de pelo, ojos, ropa y hasta el tipo de aventura que quieras.',
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
  },
];

const STATS = [
  { value: '10K+', label: 'Libros vendidos', color: 'from-pink-500 to-rose-500' },
  { value: '98%', label: 'Clientes felices', color: 'from-yellow-400 to-orange-500' },
  { value: '50+', label: 'Paises alcanzados', color: 'from-blue-400 to-cyan-500' },
  { value: '4.9', label: 'Calificacion promedio', color: 'from-green-400 to-emerald-500' },
];

const PLANS = [
  {
    name: 'Basico',
    subtitle: 'Primera Aventura',
    description: 'Perfecto para conocer nuestros libros personalizados.',
    price: '$19.99',
    period: 'por libro',
    color: 'from-blue-400 to-indigo-500',
    features: [
      '1 libro personalizado (24 páginas)',
      'Nombre y apariencia del niño/a',
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
    color: 'from-pink-400 via-rose-500 to-fuchsia-500',
    features: [
      '3 libros personalizados (24 páginas c/u)',
      'Nombre y apariencia de cada niño',
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
    color: 'from-yellow-400 via-orange-500 to-red-500',
    features: [
      '5 libros personalizados (28 páginas c/u)',
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
    <div className="min-h-screen overflow-x-hidden relative">
      {/* Storybook Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-100 via-amber-50 to-pink-100" />
        
        {/* Floating clouds */}
        <div className="absolute top-20 left-10 w-32 h-16 bg-white rounded-full blur-xl opacity-80 animate-pulse" />
        <div className="absolute top-40 right-20 w-40 h-20 bg-white rounded-full blur-xl opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-60 left-1/3 w-36 h-18 bg-white rounded-full blur-xl opacity-60 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-1/4 w-28 h-14 bg-white rounded-full blur-xl opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Stars */}
        <div className="absolute top-16 right-1/3 text-yellow-400 animate-twinkle">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="absolute top-32 left-1/4 text-pink-400 animate-twinkle" style={{ animationDelay: '0.3s' }}>
          <Sparkles className="w-3 h-3" />
        </div>
        <div className="absolute top-48 right-1/4 text-blue-400 animate-twinkle" style={{ animationDelay: '0.7s' }}>
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="absolute bottom-60 left-1/5 text-purple-400 animate-twinkle" style={{ animationDelay: '1.2s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
        
        {/* Sun */}
        <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full blur-md opacity-60" />
        <Sun className="absolute top-12 right-12 w-16 h-16 text-yellow-400 opacity-40" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-pink-200/50" style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-300/30">
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
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white text-sm font-semibold hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-400/30"
          >
            Contactar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {/* Rainbow arc */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-t-full border-[40px] border-transparent border-t-red-400/20 border-l-orange-300/20 border-r-blue-400/20 opacity-50" />
          
          {/* Colorful blobs */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300/40 rounded-full blur-3xl" />
          <div className="absolute top-40 right-10 w-40 h-40 bg-pink-300/40 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/2 w-48 h-48 bg-blue-300/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-36 h-36 bg-green-300/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-300/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 border border-pink-300 text-pink-600 text-sm font-semibold mb-6 shadow-lg shadow-pink-200/30">
            <Sparkles className="w-4 h-4 text-yellow-500" />
            Historias que enamoran
            <Rainbow className="w-4 h-4 text-purple-500" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">Libros personalizados</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent">para los mas pequeños</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Creamos historias unicas donde tu hijo/a es el protagonista.
            Regalos memorables que duran toda la vida. Envio a todo el mundo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#books"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-sm hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 transition-all active:scale-[0.98] flex items-center gap-2 shadow-xl shadow-pink-400/30"
            >
              Ver Libros <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-white text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all border-2 border-pink-200 shadow-lg shadow-pink-100/30"
            >
              Ver Precios
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/90 border-2 border-pink-200 rounded-3xl p-5 text-center shadow-lg shadow-pink-100/30 hover:scale-105 transition-transform">
                <p className={cn('text-2xl md:text-3xl font-black bg-gradient-to-r bg-clip-text text-transparent', stat.color)}>{stat.value}</p>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-50/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-bold mb-3">Por que elegirnos</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Caracteristicas</h2>
            <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto font-medium">
              Libros personalizados de alta calidad para los mas pequeños de la casa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={cn('bg-white border-2 rounded-3xl p-6 hover:shadow-xl transition-all group', feature.borderColor)}
              >
                <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center mb-4', feature.bgColor)}>
                  <feature.icon className={cn('w-7 h-7', feature.color)} />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Gallery */}
      <section id="books" className="py-20 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/50 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-bold mb-3">Nuestros Libros</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Ejemplos de Libros</h2>
            <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto font-medium">
              Cada libro es una aventura unica. Elige la que mas le guste a tu hijo/a.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {BOOKS.map((book, i) => (
              <Link
                href={`/libros/${book.id}`}
                className="block bg-white rounded-3xl overflow-hidden shadow-xl shadow-pink-200/40 hover:shadow-2xl hover:shadow-pink-300/40 transition-all group border-2 border-pink-100 hover:border-pink-300 hover:-translate-y-2"
              >
                {/* Book Cover */}
                <div className={cn('relative aspect-[3/4] bg-gradient-to-br', book.color, 'flex items-center justify-center overflow-hidden')}>
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Book icon overlay */}
                  <div className="absolute top-4 left-4 bg-white/95 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                    <book.icon className="w-5 h-5 text-pink-500" />
                  </div>
                  
                  {/* Price tag */}
                  <div className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-full shadow-lg">
                    <span className="text-sm font-black text-gray-800">{book.price}</span>
                  </div>
                  
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-black text-white leading-tight drop-shadow-lg">{book.title}</h3>
                    <p className="text-sm text-white/90 mt-1 font-medium drop-shadow-md">{book.pages}</p>
                  </div>
                </div>
                
                {/* Book Info */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-pink-500 transition-colors">{book.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{book.description}</p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white text-sm font-bold transition-all shadow-lg shadow-pink-400/30">
                    <BookOpen className="w-4 h-4" />
                    Ver detalle
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-bold mb-3">Proceso</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Como funciona</h2>
            <p className="text-sm text-gray-500 mt-3 font-medium">En 3 pasos simples tienes el libro perfecto.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Elige tu libro', desc: 'Selecciona la aventura que mas le guste a tu niño/a y personaliza los detalles.', icon: BookOpen, color: 'from-blue-400 to-indigo-500' },
              { step: '02', title: 'Personalizalo', desc: 'Agrega el nombre, apariencia y cualquier detalle especial que quieras.', icon: Palette, color: 'from-pink-400 to-rose-500' },
              { step: '03', title: 'Recibelo en casa', desc: 'Enviamos el libro a tu puerta en 7-14 dias. Listo para leer y disfrutar.', icon: Gift, color: 'from-yellow-400 to-orange-500' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={cn('w-24 h-24 rounded-3xl bg-gradient-to-br border-2 border-white flex items-center justify-center mx-auto mb-5 shadow-xl', item.color)}>
                  <item.icon className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-50/50 to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[11px] text-pink-500 uppercase tracking-wider font-bold mb-3">Precios</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800">Planes de Libros</h2>
            <p className="text-sm text-gray-500 mt-3 font-medium">Regalos especiales a precios accesibles.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-3xl border-2 transition-all overflow-hidden',
                  plan.highlighted
                    ? 'bg-white border-pink-300 shadow-2xl shadow-pink-300/30 scale-105'
                    : 'bg-white border-pink-200 shadow-lg shadow-pink-100/30'
                )}
              >
                {/* Plan header color bar */}
                <div className={cn('h-2 bg-gradient-to-r', plan.color)} />
                
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white text-[10px] font-bold m-6 mb-0 shadow-lg shadow-pink-400/30">
                    <Star className="w-3 h-3" /> Mas Vendido
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                  <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider mt-1">{plan.subtitle}</p>
                  <p className="text-sm text-gray-500 mt-2">{plan.description}</p>

                  <div className="mt-4 mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className={cn('text-4xl font-black bg-gradient-to-r bg-clip-text text-transparent', plan.color)}>{plan.price}</span>
                      <span className="text-sm text-gray-400 font-medium">{plan.period}</span>
                    </div>
                  </div>

                  <div className="h-px bg-gradient-to-r from-pink-200 to-purple-200 mb-4" />

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className={cn('w-4 h-4 flex-shrink-0', plan.highlighted ? 'text-pink-500' : 'text-gray-300')} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}%20de%20libros%20personalizados`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all',
                      plan.highlighted
                        ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 shadow-xl shadow-pink-400/30'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-gray-200'
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
      <section className="py-20 px-5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 drop-shadow-lg">
            Regala una aventura
            <br />
            <span className="text-yellow-300">que nunca olvidaran</span>
          </h2>
          <p className="text-base text-white/90 mb-8 max-w-lg mx-auto font-medium">
            Libros personalizados para los mas pequeños. Sorprende a tu niño/a con una historia unica.
          </p>
          <a
            href="https://wa.me/573026456024?text=Hola,%20quiero%20crear%20un%20libro%20personalizado%20para%20mi%20hijo/a"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-pink-600 font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.98] shadow-2xl shadow-black/20"
          >
            <MessageCircle className="w-5 h-5" />
            Crea tu libro desde cero
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 py-8 px-5 border-t border-pink-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-300/30">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-700">Libros Magicos - TraccionWeb</span>
          </div>
          <p className="text-xs text-gray-500 font-medium">Desarrollado por TraccionWeb</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/573026456024?text=Hola,%20quiero%20crear%20un%20libro%20personalizado%20desde%20cero"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-6 py-4 rounded-full bg-[#25D366] text-white font-black text-sm shadow-2xl shadow-green-500/40 hover:bg-[#20bd5a] transition-all active:scale-95"
        aria-label="Crear libro por WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
        Crea tu libro desde cero
      </a>
    </div>
  );
}
