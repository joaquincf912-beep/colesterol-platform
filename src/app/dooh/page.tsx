'use client';

import {
  Monitor, Eye, TrendingUp, Users, Zap, Globe,
  Check, ArrowRight, Star, MessageCircle, Clock,
  BarChart3, Target, Smartphone, Wifi, Layout, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Monitor,
    title: 'Pantallas LED Premium',
    description: 'Pantallas de alta resolucion en locations de alto trafico: centros comerciales, restaurantes y zonas premium.',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
  },
  {
    icon: Target,
    title: 'Segmentacion Geografica',
    description: 'Segmenta tu anuncio por zona geografica, horario y audiencia. Control total desde un dashboard.',
    color: 'text-[#FFC700]',
    bgColor: 'bg-[#FFC700]/10',
  },
  {
    icon: BarChart3,
    title: 'Metricas en Tiempo Real',
    description: 'Impresiones, alcance, engagement y ROI medido en tiempo real desde tu panel de control.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: Zap,
    title: 'Cambio Instantaneo',
    description: 'Cambia tu creative en segundos sin imprmir nada. Actualizaciones remotas via nube.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Globe,
    title: 'Multi-Pantalla',
    description: 'Un mismo anuncio se despliega en multiples pantallas simultaneamente con sincronizacion total.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Layout,
    title: 'Creative Service',
    description: 'Diseno de piezas graficas y videos animados optimizados para cada formato de pantalla.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10',
  },
];

const STATS = [
  { value: '50K+', label: 'Impresiones diarias' },
  { value: '85%', label: 'Recuerdo de marca' },
  { value: '3x', label: 'Mas engagement vs digital' },
  { value: '24/7', label: 'Publicidad continua' },
];

const LOCATIONS = [
  { name: 'Centros Comerciales', screens: '12 pantallas', reach: '15K personas/dia' },
  { name: 'Restaurantes', screens: '8 pantallas', reach: '8K personas/dia' },
  { name: 'Zonas de Comida Rapida', screens: '6 pantallas', reach: '12K personas/dia' },
  { name: 'Estaciones de Transporte', screens: '4 pantallas', reach: '20K personas/dia' },
];

const VIDEOS = [
  {
    title: 'Produccion Fotografica Profesional',
    description: 'Sesion de fotos con iluminacion profesional, composicion artistica y acabado comercial de alta gama.',
    pinUrl: 'https://www.pinterest.com/pin/617063586489368446/',
    thumbnail: 'https://i.pinimg.com/736x/56/0d/0a/560d0a4d4989dd8e1bbd50a599459294.jpg',
  },
  {
    title: 'Contenido Visual para Marcas',
    description: 'Video producido para marca de moda con edicion cinematica, movimiento de camara y color grading profesional.',
    pinUrl: 'https://www.pinterest.com/pin/303570831155094859/',
    thumbnail: 'https://i.pinimg.com/736x/f7/b5/c0/f7b5c096a2d34976b502e7cd1c74e513.jpg',
  },
  {
    title: 'Publicidad de Producto Premium',
    description: 'Spot publicitario con close-up de producto, efectos de movimiento y narrativa visual de alto impacto.',
    pinUrl: 'https://www.pinterest.com/pin/1108378158339782703/',
    thumbnail: 'https://i.pinimg.com/736x/d2/e5/cb/d2e5cbb52c0df4fb35bb23e33a9c959d.jpg',
  },
];

const PLANS = [
  {
    name: 'Starter',
    subtitle: 'Presencia Local',
    description: 'Ideal para negocios locales que quieren presencia en 1-2 pantallas.',
    price: '$50',
    period: '/semana',
    features: [
      '1 pantalla LED en zona premium',
      'Diseño de pieza grafica basico',
      'Rotacion cada 15 segundos',
      'Reporte semanal de impresiones',
      'Soporte por WhatsApp',
    ],
    highlighted: false,
  },
  {
    name: 'Growth',
    subtitle: 'Alcance Multi-Zona',
    description: 'Para marcas que quieren cubrir multiples zonas de la ciudad.',
    price: '$120',
    period: '/semana',
    features: [
      '3-5 pantallas en distintas zonas',
      'Diseno de creative profesional',
      'Video animado de hasta 15 seg',
      'Segmentacion por horario',
      'Dashboard de metricas en tiempo real',
      'A/B testing de creativos',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    subtitle: 'Dominacion de Mercado',
    description: 'Para marcas que quieren presencia dominante en toda la ciudad.',
    price: '$250',
    period: '/semana',
    features: [
      '10+ pantallas en toda la ciudad',
      'Produccion de video profesional',
      'Campañas dinámicas con datos en tiempo real',
      'Dashboard premium con analytics',
      'Manager de cuenta dedicado',
      'Reportes mensuales con ROI',
      'Actualizaciones ilimitadas',
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
              <Monitor className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">TraccionWeb DOOH</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
            <a href="#features" className="hover:text-white/70 transition-colors">Servicios</a>
            <a href="#locations" className="hover:text-white/70 transition-colors">Ubicaciones</a>
            <a href="#pricing" className="hover:text-white/70 transition-colors">Precios</a>
          </div>
          <a
            href="https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20publicidad%20DOOH"
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
            <Monitor className="w-3 h-3" />
            Powered by TraccionWeb
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
            Publicidad en
            <br />
            <span className="text-violet-400">pantallas digitales</span> DOOH
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Lleva tu marca a pantallas LED en los mejores locations de la ciudad. 
            Publicidad exterior digital con metricas reales. Construido por TraccionWeb.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#pricing"
              className="px-8 py-4 rounded-2xl bg-violet-500 text-white font-semibold text-sm hover:bg-violet-400 transition-all active:scale-[0.98] flex items-center gap-2"
            >
              Ver Planes <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#locations"
              className="px-8 py-4 rounded-2xl bg-white/[0.04] text-white/60 font-semibold text-sm hover:bg-white/[0.06] transition-all border border-white/[0.06]"
            >
              Ver Ubicaciones
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
              Publicidad exterior digital con control total, metricas reales y creativos profesionales.
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
              <a
                key={i}
                href={video.pinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/[0.02] border border-white/[0.04] rounded-3xl overflow-hidden hover:bg-white/[0.03] transition-all group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm">
                    <span className="text-[9px] text-white/60 font-medium">VIDEO</span>
                  </div>
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-violet-500/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-violet-400 transition-colors">{video.title}</h3>
                  <p className="text-[11px] text-white/30 leading-relaxed">{video.description}</p>
                </div>
              </a>
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
            <p className="text-sm text-white/30 mt-3">De la idea a la pantalla en 3 pasos simples.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '01', title: 'Elige tu plan', desc: 'Selecciona la cantidad de pantallas y ubicaciones que necesitas.' },
              { step: '02', title: 'Diseñamos tu creative', desc: 'Nuestro equipo crea piezas graficas o videos optimizados para LED.' },
              { step: '03', title: 'Tu anuncio esta en vivo', desc: 'Subimos el contenido a las pantallas y tu marca empieza a verse.' },
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

      {/* Locations */}
      <section id="locations" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-violet-400 uppercase tracking-wider font-medium mb-3">Ubicaciones</p>
            <h2 className="text-3xl md:text-4xl font-black">Donde se ve tu anuncio</h2>
            <p className="text-sm text-white/30 mt-3">Pantallas estrategicamente ubicadas en zonas de alto trafico.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOCATIONS.map((loc, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 flex items-center justify-between hover:bg-white/[0.03] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{loc.name}</h3>
                    <p className="text-[10px] text-white/30">{loc.screens}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-violet-400">{loc.reach}</p>
                  <p className="text-[10px] text-white/20">alcance diario</p>
                </div>
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
            <h2 className="text-3xl md:text-4xl font-black">Planes DOOH</h2>
            <p className="text-sm text-white/30 mt-3">Publicidad que se paga sola. Sin contratos largos.</p>
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
                    href={`https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}%20de%20DOOH`}
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
            Tu marca necesita
            <br />
            <span className="text-violet-400">verse en grande</span>
          </h2>
          <p className="text-sm text-white/30 mb-8 max-w-lg mx-auto">
            Publicidad en las mejores pantallas de la ciudad. Cotiza ahora y empieza a impactar.
          </p>
          <a
            href="https://wa.me/573026456024?text=Hola,%20quiero%20cotizar%20publicidad%20DOOH%20para%20mi%20negocio"
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
              <Monitor className="w-3 h-3 text-white" />
            </div>
            <span className="text-xs text-white/30">TraccionWeb DOOH</span>
          </div>
          <p className="text-[10px] text-white/15">Desarrollado por TraccionWeb</p>
        </div>
      </footer>
    </div>
  );
}
