'use client';


import {
  Smartphone, Monitor, Zap, Shield, BarChart3, Truck,
  ChefHat, Clock, Wifi, Globe, MessageCircle, Check,
  ArrowRight, Star, TrendingUp, Users, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    icon: Smartphone,
    title: 'Menu Digital',
    description: 'App web premium para que tus clientes ordenen desde el celular con experiencia nativa.',
    color: 'text-[#FFC700]',
    bgColor: 'bg-[#FFC700]/10',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Display',
    description: 'Sistema de pedidos para cocina con actualizaciones en tiempo real y alertas de sonido.',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10',
  },
  {
    icon: Truck,
    title: 'App de Reparto',
    description: 'PWA para domiciliarios con mapa, contacto directo y prueba de entrega.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: BarChart3,
    title: 'Dashboard Admin',
    description: 'Metricas en tiempo real, inventario, pedidos y configuracion desde un solo panel.',
    color: 'text-green-400',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: Zap,
    title: 'Real-Time',
    description: 'Pedidos que aparecen al instante en cocina sin recargar la pagina. WebSocket puro.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: CreditCard,
    title: 'Multi-Pago',
    description: 'Efectivo, Pago Movil, Zelle, Binance. Integracion con WhatsApp automatica.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
  },
];

const STATS = [
  { value: '3x', label: 'Mas pedidos vs telefono' },
  { value: '40%', label: 'Reduccion de errores' },
  { value: '<1s', label: 'Tiempo de sincronizacion' },
  { value: '99.9%', label: 'Uptime garantizado' },
];

const PRICING = [
  {
    name: 'Starter',
    setup: '$100',
    setupLabel: 'activacion unica',
    price: '$25',
    period: '/mes',
    description: 'Para restaurantes que empiezan',
    features: [
      'Menu digital personalizado',
      'Checkout con WhatsApp',
      'Hasta 30 productos',
      'Soporte por WhatsApp',
    ],
    highlighted: false,
  },
  {
    name: 'Growth',
    setup: '$150',
    setupLabel: 'activacion unica',
    price: '$38',
    period: '/mes',
    description: 'Para restaurantes en crecimiento',
    features: [
      'Todo lo de Starter',
      'Kitchen Display System',
      'App de reparto (PWA)',
      'Dashboard con metricas',
      'Multi-moneda (USD/VES)',
      'Soporte prioritario',
    ],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    setup: '$300',
    setupLabel: 'activacion unica',
    price: '$42',
    period: '/mes',
    description: 'Para cadenas y franquicias',
    features: [
      'Todo lo de Growth',
      'Multi-restaurante',
      'API personalizada',
      'Integracion con POS',
      'Account manager dedicado',
      'SLA 99.99%',
    ],
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFC700] flex items-center justify-center">
              <span className="text-sm font-black text-black">C</span>
            </div>
            <span className="text-sm font-bold text-white">TraccionWeb App</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
            <a href="#features" className="hover:text-white/70 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white/70 transition-colors">Pricing</a>
            <a href="#demo" className="hover:text-white/70 transition-colors">Demo</a>
          </div>
          <a
            href="https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20TraccionWeb%20App"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-[#FFC700] text-black text-xs font-semibold hover:bg-[#FFD633] transition-colors"
          >
            Contactar
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-5 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FFC700]/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFC700]/10 border border-[#FFC700]/20 text-[#FFC700] text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              Powered by TraccionWeb
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
              Tu restaurante,
              <br />
              <span className="text-[#FFC700]">una app de </span>
              <span className="text-[#FFC700]">$1,000,000</span>
            </h1>

            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-10 leading-relaxed">
              Menu digital, cocina conectada, reparto inteligente y dashboard completo.
              Todo sincronizado en tiempo real. Construido por TraccionWeb.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#demo"
                className="px-8 py-4 rounded-2xl bg-[#FFC700] text-black font-semibold text-sm hover:bg-[#FFD633] transition-all active:scale-[0.98] flex items-center gap-2"
              >
                Ver Demo <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#pricing"
                className="px-8 py-4 rounded-2xl bg-white/[0.04] text-white/60 font-semibold text-sm hover:bg-white/[0.06] transition-all border border-white/[0.06]"
              >
                Ver Precios
              </a>
            </div>
          </div>

          {/* Stats */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-[#FFC700]">{stat.value}</p>
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
            <p className="text-[11px] text-[#FFC700] uppercase tracking-wider font-medium mb-3">Features</p>
            <h2 className="text-3xl md:text-4xl font-black">Todo lo que necesitas</h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
              Cuatro aplicaciones conectadas, una sola base de datos, cero latencia.
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
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#FFC700] transition-colors">{feature.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Live */}
      <section id="demo" className="py-20 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-[#FFC700] uppercase tracking-wider font-medium mb-3">Demo Interactivo</p>
            <h2 className="text-3xl md:text-4xl font-black">Prueba el sistema completo</h2>
            <p className="text-sm text-white/30 mt-3 max-w-lg mx-auto">
              Interactua directamente con cada modulo. Haz un pedido, revisalo en cocina, sigue el reparto.
            </p>
          </div>

          {/* Menu Demo - Full Width (mockup ligero, sin iframe) */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#FFC700]" />
              <span className="text-sm font-bold text-white">Menu del Cliente</span>
              <span className="text-[10px] text-white/20">app.traccionweb.com</span>
            </div>
            <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5 p-6" style={{ height: 500 }}>
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Como quieres tu pedido</p>
                    <p className="text-lg font-black text-white mt-0.5">¿Qué quieres hoy?</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#FFC700] flex items-center justify-center text-black font-black">C</div>
                </div>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  {[
                    { name: 'Smash Doble', price: '$6.99', tag: '#1 Mas vendida' },
                    { name: 'Crispy Chicken', price: '$5.99', tag: 'Nueva' },
                    { name: 'Papas Supreme', price: '$3.49', tag: 'Con queso' },
                    { name: 'Malteada Oreo', price: '$2.99', tag: 'Fria' },
                  ].map((item) => (
                    <div key={item.name} className="bg-[#000000] rounded-2xl border border-white/5 p-4 flex flex-col justify-between">
                      <div>
                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-[#2C2C2E] to-[#1C1C1E] mb-3 flex items-center justify-center">
                          <span className="text-3xl opacity-40">🍔</span>
                        </div>
                        <p className="text-sm font-bold text-white">{item.name}</p>
                        <p className="text-[10px] text-white/30">{item.tag}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[#FFC700] font-black">{item.price}</span>
                        <div className="w-7 h-7 rounded-full bg-[#FFC700] flex items-center justify-center text-black font-black text-sm">+</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* KDS + Delivery + Admin - 3 columns (mockups ligeros) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* KDS */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-sm font-bold text-white">Cocina (KDS)</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5 p-4" style={{ height: 350 }}>
                <div className="space-y-3">
                  {[
                    { id: '#034', items: '2x Smash Doble', time: '5 min', color: 'border-white/20' },
                    { id: '#035', items: '1x Crispy + Papas', time: '12 min', color: 'border-[#FFC700]' },
                    { id: '#036', items: '3x Malteada', time: '21 min', color: 'border-red-500' },
                  ].map((o) => (
                    <div key={o.id} className={`bg-[#000000] rounded-xl border-l-4 ${o.color} p-3`}>
                      <div className="flex justify-between items-center">
                        <span className="text-white font-black text-sm">{o.id}</span>
                        <span className="text-[10px] text-white/40">{o.time}</span>
                      </div>
                      <p className="text-xs text-white/60 mt-1">{o.items}</p>
                      <div className="h-1.5 rounded-full bg-white/5 mt-2 overflow-hidden">
                        <div className="h-full w-2/3 bg-[#FFC700] rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm font-bold text-white">Reparto</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5 p-4" style={{ height: 350 }}>
                <div className="bg-[#000000] rounded-xl p-4 h-full">
                  <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Entrega activa</p>
                  <p className="text-white font-black text-lg mt-1">Pedido #035</p>
                  <div className="relative h-28 rounded-xl bg-gradient-to-br from-[#1a2b1a] to-[#0a1a0a] my-3 overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(50,205,50,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(50,205,50,0.08) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                    <div className="absolute left-[15%] top-[60%] w-3 h-3 rounded-full bg-[#32D74B]" />
                    <div className="absolute left-[70%] top-[25%] w-3 h-3 rounded-full bg-[#FFC700]" />
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M 18 62 Q 45 30 68 27" stroke="#32D74B" strokeWidth="1.5" fill="none" strokeDasharray="4 3" /></svg>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-[#32D74B]/10 border border-[#32D74B]/30 rounded-lg py-2 text-center text-[10px] font-bold text-[#32D74B]">Llamar</div>
                    <div className="flex-1 bg-[#32D74B]/10 border border-[#32D74B]/30 rounded-lg py-2 text-center text-[10px] font-bold text-[#32D74B]">WhatsApp</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-bold text-white">Admin Dashboard</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5 p-4" style={{ height: 350 }}>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    { label: 'Ventas hoy', value: '$248', c: 'text-[#FFC700]' },
                    { label: 'Pedidos', value: '34', c: 'text-white' },
                    { label: 'Ticket prom.', value: '$7.29', c: 'text-white' },
                    { label: 'En cocina', value: '6', c: 'text-orange-400' },
                  ].map((s) => (
                    <div key={s.label} className="bg-[#000000] rounded-xl p-3">
                      <p className="text-[9px] text-white/30 uppercase font-bold">{s.label}</p>
                      <p className={`text-lg font-black ${s.c}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#000000] rounded-xl p-3">
                  <p className="text-[9px] text-white/30 uppercase font-bold mb-2">Ventas por hora</p>
                  <div className="flex items-end gap-1.5 h-20">
                    {[35, 55, 40, 70, 90, 65, 80, 100, 75, 60, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-[#FFC700]/20 to-[#FFC700] rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Open Full Screen Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://app.traccionweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#FFC700] text-black text-sm font-semibold hover:bg-[#FFD633] transition-all active:scale-[0.98]"
            >
              Abrir Menu Completo <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://app.traccionweb.com/pedidos"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.04] text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-all border border-white/[0.06]"
            >
              Abrir Cocina <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://app.traccionweb.com/delivery"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.04] text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-all border border-white/[0.06]"
            >
              Abrir Reparto <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://app.traccionweb.com/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.04] text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-all border border-white/[0.06]"
            >
              Abrir Admin <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] text-[#FFC700] uppercase tracking-wider font-medium mb-3">Pricing</p>
            <h2 className="text-3xl md:text-4xl font-black">Planes para cada negocio</h2>
            <p className="text-sm text-white/30 mt-3">Sin contratos largos. Cancela cuando quieras.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING.map((plan, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-3xl p-6 border transition-all',
                  plan.highlighted
                    ? 'bg-[#FFC700]/5 border-[#FFC700]/20 shadow-[0_0_40px_rgba(255,199,0,0.05)]'
                    : 'bg-white/[0.02] border-white/[0.04]'
                )}
              >
                {plan.highlighted && (
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFC700]/10 text-[#FFC700] text-[10px] font-medium mb-4">
                    <Star className="w-3 h-3" /> Popular
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-white/30 mt-1">{plan.description}</p>
                <div className="mt-4 mb-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">{plan.price}</span>
                    <span className="text-sm text-white/30">{plan.period}</span>
                  </div>
                  <p className="text-[10px] text-white/25 mt-1">+ {plan.setup} {plan.setupLabel}</p>
                </div>
                <div className="h-px bg-white/[0.04] my-4" />
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                      <Check className="w-3.5 h-3.5 text-[#FFC700] flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href={`https://wa.me/573026456024?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'block w-full py-3 rounded-2xl text-center text-sm font-semibold transition-all',
                    plan.highlighted
                      ? 'bg-[#FFC700] text-black hover:bg-[#FFD633]'
                      : 'bg-white/[0.04] text-white/60 hover:bg-white/[0.06] border border-white/[0.06]'
                  )}
                >
                  Empezar ahora
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <div
          >
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Tu restaurante merece
              <br />
              <span className="text-[#FFC700]"> algo extraordinario</span>
            </h2>
            <p className="text-sm text-white/30 mb-8 max-w-lg mx-auto">
              Unete a los restaurantes que ya estan vendiendo mas con tecnología de clase mundial.
            </p>
            <a
              href="https://wa.me/573026456024?text=Hola,%20quiero%20una%20demo%20de%20TraccionWeb%20App"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20BD5A] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Solicitar Demo Gratis
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#FFC700] flex items-center justify-center">
              <span className="text-[10px] font-black text-black">C</span>
            </div>
            <span className="text-xs text-white/30">TraccionWeb App</span>
          </div>
          <p className="text-[10px] text-white/15">Desarrollado por TraccionWeb</p>
        </div>
      </footer>
    </div>
  );
}
