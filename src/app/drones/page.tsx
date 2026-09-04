'use client';

import {
  Plane, Camera, Video, Eye, Clock, Battery,
  Check, ArrowRight, Star, MessageCircle, Zap,
  Image, Film, Monitor, Smartphone, MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Camera,
    title: '4K Ultra HD',
    description: 'Tomas aereas en resolucion 4K con estabilizacion gimbal 3 ejes.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'DJI Neo',
    description: 'Drone compacto con proteccion de helices, ideal para interiores y exteriores.',
    color: 'text-[#FFC700]',
    bgColor: 'bg-[#FFC700]/10',
  },
  {
    icon: MapPin,
    title: 'GPS Tracking',
    description: 'Ruta de vuelo automatizada, seguimiento en tiempo real y puntos de interes.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Film,
    title: 'Edicion Profesional',
    description: 'Color grading, musique, transiciones, graficos animados y texto personalizado.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Battery,
    title: 'Hasta 60 min',
    description: 'Multiples baterias para cobertura completa de tu propiedad o evento.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Smartphone,
    title: 'Entrega Digital',
    description: 'Material raw y editado entregado via nube, listo para redes sociales.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
];

const STATS = [
  { value: '4K', label: 'Calidad de video' },
  { value: '60min', label: 'Tiempo de vuelo' },
  { value: '24h', label: 'Entrega rapida' },
  { value: '100%', label: 'Satisfaccion' },
];

const PLANS = [
  {
    name: 'Basico',
    subtitle: 'Toma Express',
    description: 'Ideal para redes sociales, propiedades pequenas o cobertura puntual.',
    withoutEdit: {
      price: '$25',
      label: 'Sin edicion',
    },
    withEdit: {
      price: '$40',
      label: 'Con edicion',
    },
    withoutEditFeatures: [
      'Clips raw (brutos) en 4K',
      'Hasta 15-20 min de vuelo (1 bateria)',
      'Tomas fijas, panoramicas y barridos simples',
    ],
    withEditFeatures: [
      '1 reel/video vertical listo para redes (hasta 30 seg)',
      'Cortes dinamicos, musica en tendencia',
      'Correccion de color basica',
      'Formato HD/4K optimizado para Instagram/TikTok',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    subtitle: 'Cobertura Estandar',
    description: 'Perfecto para eventos pequenos, locales comerciales o contenido para marcas.',
    withoutEdit: {
      price: '$45',
      label: 'Sin edicion',
    },
    withEdit: {
      price: '$70',
      label: 'Con edicion',
    },
    withoutEditFeatures: [
      'Material grabado en 4K sin procesar',
      'Hasta 40 min de vuelo (2-3 baterias)',
      'QuickShots, seguimiento y diversos angulos',
    ],
    withEditFeatures: [
      '1 video principal (hasta 1 min) + 1 reel corto',
      'Correccion de color, diseno de sonido',
      'Musica libre de derechos',
      'Transiciones, texto y logo en pantalla',
      '1 ronda de revisiones',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    subtitle: 'Produccion Completa',
    description: 'Videos promocionales, bienes raices o eventos corporativos.',
    withoutEdit: {
      price: '$75',
      label: 'Sin edicion',
    },
    withEdit: {
      price: '$120',
      label: 'Con edicion',
    },
    withoutEditFeatures: [
      'Material raw organizado por carpetas/escenas',
      'Hasta 60 min de vuelo en locacion',
      'Tomas en exteriores e interiores',
    ],
    withEditFeatures: [
      '1 video promocional (hasta 2 min) + 2 reels/shorts',
      'Edicion profesional completa',
      'Ritmatizacion, etalonaje de color',
      'Graficos/titulos animados y mezcla de audio',
      '2 rondas de revisiones',
    ],
    highlighted: false,
  },
];

export default function DronesPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">TraccionWeb Drones</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
            <a href="#features" className="hover:text-white/70 transition-colors">Servicios</a>
            <a href="#video" className="hover:text-white/70 transition-colors">Portfolio</a>
            <a href="#pricing" className="hover:text-white/70 transition-colors">Precios</a>
          </div>
          <a
            href="https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20los%20servicios%20de%20drones"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-cyan-500 text-white text-xs font-semibold hover:bg-cyan-400 transition-colors"
          >
            Contactar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-6">
            <Plane className="w-3 h-3" />
            Powered by TraccionWeb
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            Fotos y videos
            <br />
            <span className="text-cyan-400">con drone</span> profesionales
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Captura aerea en 4K con DJI Neo. Ideal para negocios, inmobiliarias, eventos y redes sociales.
            Construido por TraccionWeb.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-cyan-500 text-white font-semibold text-sm hover:bg-cyan-400 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              Ver Precios <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#video"
              className="px-8 py-4 rounded-2xl bg-white/[0.04] text-white/60 font-semibold text-sm hover:bg-white/[0.06] transition-all border border-white/[0.06]"
            >
              Ver Ejemplos
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-cyan-400">{stat.value}</p>
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
            <p className="text-[11px] text-cyan-400 uppercase tracking-wider font-medium mb-3">Servicios</p>
            <h2 className="text-3xl md:text-4xl font-black">Que ofrecemos</h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
              Vuelo automatizado, edicion profesional y entrega rapida en formato digital.
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
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section id="video" className="py-20 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-cyan-400 uppercase tracking-wider font-medium mb-3">Portfolio</p>
            <h2 className="text-3xl md:text-4xl font-black">Mira el resultado</h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
              Video de muestra para mostrar la calidad de imagen y colores del servicio.
            </p>
          </div>

          {/* Video Player */}
          <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5">
            <video
              className="w-full aspect-video object-cover"
              controls
              preload="metadata"
              poster=""
            >
              <source src="/drone-sample.MOV" type="video/quicktime" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>

          {/* Video Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
              <Camera className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">4K Ultra HD</p>
              <p className="text-[10px] text-white/30 mt-1">Resolucion profesional</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
              <Eye className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Vuelo Automatizado</p>
              <p className="text-[10px] text-white/30 mt-1">Rutas predefinidas con GPS</p>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
              <Clock className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-white">Entrega en 24h</p>
              <p className="text-[10px] text-white/30 mt-1">Material listo al dia siguiente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-cyan-400 uppercase tracking-wider font-medium mb-3">Precios</p>
            <h2 className="text-3xl md:text-4xl font-black">Planes de vuelo</h2>
            <p className="text-sm text-white/30 mt-3">Elige sin edicion (raw) o con edicion profesional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-3xl border transition-all overflow-hidden',
                  plan.highlighted
                    ? 'bg-cyan-500/5 border-cyan-500/20 shadow-[0_0_40px_rgba(6,182,212,0.05)]'
                    : 'bg-white/[0.02] border-white/[0.04]'
                )}
              >
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-medium m-6 mb-0">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider mt-1">{plan.subtitle}</p>
                  <p className="text-xs text-white/30 mt-2">{plan.description}</p>

                  {/* Prices */}
                  <div className="mt-4 space-y-3">
                    {/* Without Edit */}
                    <div className="bg-white/[0.03] rounded-2xl p-3">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">{plan.withoutEdit.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-white">{plan.withoutEdit.price}</span>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {plan.withoutEditFeatures.map((feat, j) => (
                          <li key={j} className="flex items-center gap-1.5 text-[10px] text-white/40">
                            <Check className="w-3 h-3 text-white/20 flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* With Edit */}
                    <div className={cn(
                      'rounded-2xl p-3',
                      plan.highlighted ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.03]'
                    )}>
                      <p className="text-[10px] text-cyan-400 uppercase tracking-wider mb-1">{plan.withEdit.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-cyan-400">{plan.withEdit.price}</span>
                      </div>
                      <ul className="mt-2 space-y-1.5">
                        {plan.withEditFeatures.map((feat, j) => (
                          <li key={j} className="flex items-center gap-1.5 text-[10px] text-white/40">
                            <Check className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* CTA */}
                  <a
                    href={`https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}%20de%20drones`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'block w-full py-3 rounded-2xl text-center text-sm font-semibold transition-all mt-4',
                      plan.highlighted
                        ? 'bg-cyan-500 text-white hover:bg-cyan-400'
                        : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.06] border border-white/[0.06]'
                    )}
                  >
                    Reservar Ahora
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
            <span className="text-cyan-400">una perspectiva aerea</span>
          </h2>
          <p className="text-sm text-white/30 mb-8 max-w-lg mx-auto">
            Cotiza ahora y recibe tu video en menos de 24 horas. Atencion directa por WhatsApp.
          </p>
          <a
            href="https://wa.me/573026456024?text=Hola,%20quiero%20cotizar%20un%20vuelo%20de%20drone%20para%20mi%20negocio"
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
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
              <Plane className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-white/30">TraccionWeb Drones</span>
          </div>
          <p className="text-[10px] text-white/15">Desarrollado por TraccionWeb</p>
        </div>
      </footer>
    </div>
  );
}
