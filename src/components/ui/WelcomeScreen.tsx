'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Truck, MessageCircle, ChevronRight } from 'lucide-react';

interface WelcomeScreenProps {
  onSelect: (mode: 'dine_in' | 'delivery') => void;
}

export default function WelcomeScreen({ onSelect }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cholesterol-yellow/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mb-6"
      >
        <div className="w-24 h-24 rounded-full bg-cholesterol-yellow flex items-center justify-center shadow-[0_0_60px_rgba(255,199,0,0.25)]">
          <span className="text-4xl font-black text-black tracking-tighter">C</span>
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-4xl sm:text-5xl font-black tracking-tighter text-white">
          traccionweb
        </h1>
        <p className="text-white/30 text-sm mt-2 tracking-[0.2em] uppercase font-light">
          Street Food Premium
        </p>
      </motion.div>

      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-8 relative z-10"
      >
        <p className="text-[11px] sm:text-xs text-white/40 tracking-[0.25em] uppercase font-medium">
          ¿Cómo quieres tu pedido?
        </p>
        <div className="w-8 h-0.5 bg-cholesterol-yellow mx-auto mt-3 rounded-full" />
      </motion.div>

      {/* Experience Cards */}
      <div className="w-full max-w-sm space-y-4 relative z-10">
        {/* Comer en el local */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('dine_in')}
          className="w-full group"
        >
          <div className="relative overflow-hidden rounded-[22px] p-6 text-left transition-all duration-500"
            style={{
              background: 'rgba(28, 28, 30, 0.6)',
              backdropFilter: 'blur(15px) saturate(180%)',
              WebkitBackdropFilter: 'blur(15px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 2px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-cholesterol-yellow/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[22px]" />

            <div className="relative flex items-center gap-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-cholesterol-yellow/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cholesterol-yellow/15 transition-colors duration-300">
                <UtensilsCrossed className="w-6 h-6 text-cholesterol-yellow" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-cholesterol-yellow transition-colors duration-300">
                  Comer en el local
                </h3>
                <p className="text-sm text-white/40 mt-0.5">
                  Te avisamos cuando esté listo
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-cholesterol-yellow/60 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </motion.button>

        {/* Domicilio */}
        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect('delivery')}
          className="w-full group"
        >
          <div className="relative overflow-hidden rounded-[22px] p-6 text-left transition-all duration-500"
            style={{
              background: 'rgba(28, 28, 30, 0.6)',
              backdropFilter: 'blur(15px) saturate(180%)',
              WebkitBackdropFilter: 'blur(15px) saturate(180%)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: '0 2px 30px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-cholesterol-yellow/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[22px]" />

            <div className="relative flex items-center gap-5">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-cholesterol-yellow/10 flex items-center justify-center flex-shrink-0 group-hover:bg-cholesterol-yellow/15 transition-colors duration-300">
                <Truck className="w-6 h-6 text-cholesterol-yellow" />
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-cholesterol-yellow transition-colors duration-300">
                  Domicilio
                </h3>
                <p className="text-sm text-white/40 mt-0.5">
                  Te lo llevamos a la puerta
                </p>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-cholesterol-yellow/60 group-hover:translate-x-1 transition-all duration-300" />
            </div>
          </div>
        </motion.button>
      </div>

      {/* WhatsApp Support */}
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '584141234567'}?text=${encodeURIComponent('¡Hola! Tengo una pregunta sobre el menú')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-sm mt-8 relative z-10 group"
      >
        <div className="flex items-center justify-center gap-3 py-3.5 rounded-[22px] text-white/50 text-sm font-medium transition-all duration-300 group-hover:text-white/70"
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <MessageCircle className="w-4 h-4" />
          ¿Tienes alguna pregunta? WhatsApp
        </div>
      </motion.a>

      {/* Footer Credits */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="absolute bottom-8 text-[10px] text-white/15 tracking-wide"
      >
        Desarrollado por traccionweb
      </motion.p>
    </div>
  );
}
