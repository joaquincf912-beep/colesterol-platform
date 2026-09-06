'use client';

import {
  Eye, Users, Zap, Globe,
  Check, ArrowRight, Star, MessageCircle,
  Target, Video, Film, Palette, Play, Wand2, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Film,
    title: 'Creacion de Video',
    description: 'Creamos videos cortos y profesionales optimizados para pantallas DOOH, centros comerciales y espacios publicos.',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Palette,
    title: 'Edicion Profesional',
    description: 'Edicion cinematografica, correccion de color y ajuste de imagen optimizado para cada tipo de pantalla.',
    color: 'text-[#FFC700]',
    bgColor: 'bg-[#FFC700]/10',
  },
  {
    icon: Wand2,
    title: 'Animaciones y Graficos',
    description: 'Texto animado, graficos en movimiento y efectos visuales que hacen tu video mas atractivo.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'Formatos Multiples',
    description: 'Entregamos tu video en todos los formatos: horizontal, vertical y cuadrado para cualquier pantalla DOOH.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Globe,
    title: 'Optimizado para DOOH',
    description: 'Cada video esta disenado especificamente para reproduccion en bucle con alto impacto visual en espacios publicos.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Video,
    title: 'Entrega Rapida',
    description: 'Tu video listo en 24-48 horas. Formato final optimizado en HD o 4K listo para cualquier pantalla o plataforma.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
];

const STATS = [
  { value: '24h', label: 'Entrega en 24 horas' },
  { value: '4K', label: 'Calidad Ultra HD' },
  { value: '3x', label: 'Mas impacto que estatico' },
  { value: '100%', label: 'Clientes satisfechos' },
];

const VIDEOS = [
  {
    title: 'Produccion Fotografica Profesional',
    description: 'Sesion de fotos con iluminacion profesional, composicion artistica y acabado comercial de alta gama.',
    src: '/dooh-burger.mp4',
  },
  {
    title: 'Contenido Visual para Marcas',
    description: 'Video producido para marca de moda con edicion cinematica, movimiento de camara y color grading profesional.',
    src: '/dooh-fashion.mp4',
  },
  {
    title: 'Publicidad de Producto Premium',
    description: 'Spot publicitario con close-up de producto, efectos de movimiento y narrativa visual de alto impacto.',
    src: '/dooh-protein.mp4',
  },
];

const PLANS = [
  {
    name: 'Basico',
    subtitle: 'Toma Express',
    description: 'Ideal para redes sociales, negocios locales o contenido rapido.',
    price: '$25',
    period: 'por video',
    features: [
      '1 video corto listo para usar',
      'Formato optimizado para pantalla o redes',
      'Edicion basica con musica incluida',
      'Entrega en 24 horas',
      '1 ronda de ajustes',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    subtitle: 'Produccion Completa',
    description: 'Perfecto para marcas que necesitan contenido profesional constante.',
    price: '$70',
    period: 'por video',
    features: [
      'Video de hasta 60 segundos',
      'Edicion profesional con color grading',
      'Musica libre de derechos incluida',
      'Texto y graficos animados',
      '2 rondas de revisiones',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    subtitle: 'Produccion Premium',
    description: 'Para campanas grandes, eventos corporativos o contenido de alto impacto.',
    price: '$150',
    period: 'por video',
    features: [
      'Video de hasta 2 minutos',
      'Edicion cinematografica avanzada',
      'Graficos y animaciones personalizadas',
      'Mezcla de audio profesional',
      '3 rondas de revisiones',
      'Entrega en todos los formatos DOOH',
    ],
    highlighted: false,
  },
];

export default function DOOHPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center">
              <Video className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">TraccionWeb Video</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
            <a href="#features" className="hover:text-white/70 transition-colors">Servicios</a>
            <a href="#portfolio" className="hover:text-white/70 transition-colors">Portfolio</a>
            <a href="#pricing" className="hover:text-white/70 transition-colors">Precios</a>
          </div>
          <a
            href="https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20un%20video%20DOOH"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-violet-500 text-white text-xs font-semibold hover:bg-violet-400 transition-colors"
          >
            Contactar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-500/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <Video className="w-3 h-3" />
            Powered by TraccionWeb
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            Videos cortos
            <br />
            <span className="text-violet-400">para pantallas DOOH</span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Creamos videos de alto impacto para centros comerciales, locales, restaurantes y espacios publicos.
            Tu marca en movimiento, 24 horas al dia. Construido por TraccionWeb.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-violet-500 text-white font-semibold text-sm hover:bg-violet-400 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              Ver Planes <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#portfolio"
              className="px-8 py-4 rounded-2xl bg-white/[0.04] text-white/60 font-semibold text-sm hover:bg-white/[0.06] transition-all border border-white/[0.06]"
            >
              Ver Ejemplos
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-violet-400">{stat.value}</p>
                <p className="text-[11px] text-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-violet-400 uppercase tracking-wider font-medium mb-3">Servicios</p>
            <h2 className="text-3xl md:text-4xl font-black">Que ofrecemos</h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
              Creacion de video profesional optimizado para DOOH y centros comerciales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 hover:bg-white/[0.03] transition-all group"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', feature.bgColor)}>
                  <feature.icon className={cn('w-5 h-5', feature.color)} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-violet-400 transition-colors">{feature.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section id="portfolio" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-violet-400 uppercase tracking-wider font-medium mb-3">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-black">Videos de Muestra</h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
              Ejemplos reales de calidad de imagen, iluminacion y detalle profesional en cada produccion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VIDEOS.map((video, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-3xl overflow-hidden group">
                <div className="relative aspect-[9/16]">
                  <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={video.src} type="video/mp4" />
                  </video>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">{video.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-violet-400 uppercase tracking-wider font-medium mb-3">Proceso</p>
            <h2 className="text-3xl md:text-4xl font-black">Como funciona</h2>
            <p className="text-sm text-white/30 mt-3">De la idea a tu video listo para proyectar en 3 pasos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Cuentanos tu idea', desc: 'Describe tu negocio, tu marca y el tipo de contenido que necesitas.' },
              { step: '02', title: 'Creamos tu video', desc: 'Nuestro equipo edita y produce tu video con calidad profesional y formato optimizado.' },
              { step: '03', title: 'Tu video esta listo', desc: 'Recibe tu archivo final en 24-48 horas, listo para cualquier pantalla.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-black text-violet-400">{item.step}</span>
                </div>
                <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-white/30">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-violet-400 uppercase tracking-wider font-medium mb-3">Precios</p>
            <h2 className="text-3xl md:text-4xl font-black">Planes de Produccion</h2>
            <p className="text-sm text-white/30 mt-3">Videos profesionales a precios accesibles. Sin contratos largos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-3xl border transition-all overflow-hidden',
                  plan.highlighted
                    ? 'bg-violet-500/5 border-violet-500/20 shadow-[0_0_40px_rgba(139,92,246,0.05)]'
                    : 'bg-white/[0.02] border-white/[0.04]'
                )}
              >
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-medium m-6 mb-0">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-[10px] text-violet-400 font-medium uppercase tracking-wider mt-1">{plan.subtitle}</p>
                  <p className="text-xs text-white/30 mt-2">{plan.description}</p>

                  <div className="mt-4 mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{plan.price}</span>
                      <span className="text-sm text-white/30">{plan.period}</span>
                    </div>
                  </div>

                  <div className="h-px bg-white/[0.04] mb-4" />

                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                        <Check className={cn('w-3.5 h-3.5 flex-shrink-0', plan.highlighted ? 'text-violet-400' : 'text-white/20')} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <a
                    href={`https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}%20de%20video%20DOOH`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full py-3 rounded-2xl text-center text-sm font-semibold transition-all',
                      plan.highlighted
                        ? 'bg-violet-500 text-white hover:bg-violet-400'
                        : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.06] border border-white/[0.06]'
                    )}
                  >
                    Contratar Ahora
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Tu negocio necesita
            <br />
            <span className="text-violet-400">video que impacte</span>
          </h2>
          <p className="text-sm text-white/30 mb-8 max-w-lg mx-auto">
            Videos cortos profesionales para DOOH, redes sociales y tu marca. Cotiza ahora y empieza a impactar.
          </p>
          <a
            href="https://wa.me/573026456024?text=Hola,%20quiero%20cotizar%20un%20video%20DOOH%20para%20mi%20negocio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20BD5A] transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            Cotizar por WhatsApp
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center">
              <Video className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-white/30">TraccionWeb Video</span>
          </div>
          <p className="text-[10px] text-white/15">Desarrollado por TraccionWeb</p>
        </div>
      </footer>
    </div>
  );
}
