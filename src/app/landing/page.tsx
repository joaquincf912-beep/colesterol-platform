'use client';

import { motion } from 'framer-motion';
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
    setup: '$30',
    setupLabel: 'activacion unica',
    price: '$15',
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
    setup: '$50',
    setupLabel: 'activacion unica',
    price: '$35',
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
    setup: '$100',
    setupLabel: 'activacion unica',
    price: '$79',
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
            href="https://wa.me/584225604660?text=Hola,%20estoy%20interesado%20en%20TraccionWeb%20App"
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {STATS.map((stat, i) => (
              <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-black text-[#FFC700]">{stat.value}</p>
                <p className="text-[11px] text-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-6 hover:bg-white/[0.03] transition-all group"
              >
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-4', feature.bgColor)}>
                  <feature.icon className={cn('w-5 h-5', feature.color)} />
                </div>
                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-[#FFC700] transition-colors">{feature.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed">{feature.description}</p>
              </motion.div>
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

          {/* Menu Demo - Full Width */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-[#FFC700]" />
              <span className="text-sm font-bold text-white">Menu del Cliente</span>
              <span className="text-[10px] text-white/20">app.traccionweb.com</span>
            </div>
            <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5" style={{ height: 500 }}>
              <iframe
                src="https://app.traccionweb.com"
                className="w-full h-full border-0"
                loading="lazy"
                title="Menu Demo"
              />
            </div>
          </div>

          {/* KDS + Delivery + Admin - 3 columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* KDS */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-sm font-bold text-white">Cocina (KDS)</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5" style={{ height: 350 }}>
                <iframe
                  src="https://app.traccionweb.com/pedidos"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="KDS Demo"
                />
              </div>
            </div>

            {/* Delivery */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="text-sm font-bold text-white">Reparto</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5" style={{ height: 350 }}>
                <iframe
                  src="https://app.traccionweb.com/delivery"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Delivery Demo"
                />
              </div>
            </div>

            {/* Admin */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm font-bold text-white">Admin Dashboard</span>
              </div>
              <div className="bg-[#1C1C1E] rounded-3xl overflow-hidden border border-white/5" style={{ height: 350 }}>
                <iframe
                  src="https://app.traccionweb.com/admin"
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="Admin Demo"
                />
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
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
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
                  href={`https://wa.me/584225604660?text=Hola,%20estoy%20interesado%20en%20el%20plan%20${plan.name}`}
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
              href="https://wa.me/584225604660?text=Hola,%20quiero%20una%20demo%20de%20TraccionWeb%20App"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20BD5A] transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4" />
              Solicitar Demo Gratis
            </a>
          </motion.div>
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
