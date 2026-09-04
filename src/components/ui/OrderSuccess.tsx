'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';
import { Clock, MapPin, MessageCircle, ArrowRight, RotateCcw, Check } from 'lucide-react';
import { useCart } from '@/stores/cart';
import { formatPrice, cn } from '@/lib/utils';
import type { PaymentMethod } from '@/types';
import { PAYMENT_LABELS } from '@/types';

interface OrderSuccessProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: number;
  customerName: string;
  paymentMethod: PaymentMethod;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  orderMode: 'dine_in' | 'delivery';
  onClose: () => void;
}

// ============================================
// MINIMALIST CONFETTI
// ============================================
function Confetti() {
  const [particles, setParticles] = useState<{ id: number; x: number; delay: number; color: string; size: number }[]>([]);

  useEffect(() => {
    const colors = ['#FFC700', '#32D74B', '#FFFFFF', '#FF453A', '#5AC8FA'];
    const p = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 3,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 1.5 + Math.random(),
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            left: `${p.x}%`,
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// ANIMATED CHECK ICON
// ============================================
function AnimatedCheck() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: 'spring',
        damping: 12,
        stiffness: 200,
        delay: 0.2,
      }}
      className="relative"
    >
      {/* Glow ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
        className="absolute inset-0 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(50,215,75,0.3), transparent 70%)' }}
      />

      {/* Main circle */}
      <motion.div
        className="w-24 h-24 rounded-full flex items-center justify-center relative"
        style={{
          background: 'linear-gradient(135deg, #32D74B, #28A745)',
          boxShadow: '0 4px 30px rgba(50,215,75,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        {/* SVG Checkmark — draws itself */}
        <motion.svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.svg>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN ORDER SUCCESS
// ============================================
export default function OrderSuccess({
  isOpen,
  orderId,
  orderNumber,
  customerName,
  paymentMethod,
  total,
  items,
  orderMode,
  onClose,
}: OrderSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const clearCart = useCart((s) => s.clearCart);

  // Store active order in localStorage for persistence
  useEffect(() => {
    if (isOpen && orderId) {
      const activeOrder = {
        orderId,
        orderNumber,
        customerName,
        paymentMethod,
        total,
        items,
        orderMode,
        status: 'received',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('colesterol-active-order', JSON.stringify(activeOrder));
    }
  }, [isOpen, orderId, orderNumber, customerName, paymentMethod, total, items, orderMode]);

  // Show confetti on mount
  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clear cart on mount (safety net)
  useEffect(() => {
    if (isOpen) {
      clearCart();
    }
  }, [isOpen, clearCart]);

  const handleTrackOrder = useCallback(() => {
    onClose();
    window.location.href = `/track/${orderNumber}`;
  }, [orderNumber, onClose]);

  const handleNewOrder = useCallback(() => {
    localStorage.removeItem('colesterol-active-order');
    onClose();
  }, [onClose]);

  const handleWhatsAppSupport = useCallback(() => {
    const message = `Hola, tengo una duda con mi pedido #${orderNumber} en TraccionWeb.`;
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573026456024';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  }, [orderNumber]);

  const displayNumber = String(orderNumber).padStart(3, '0');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          style={{
            background: '#000000',
          }}
        >
          {/* Confetti */}
          {showConfetti && <Confetti />}

          {/* Content */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 280,
              mass: 0.8,
            }}
            className="w-full max-w-lg max-h-[95vh] overflow-y-auto"
            style={{
              background: '#000000',
            }}
          >
            <div className="px-6 pt-10 pb-10 space-y-8">
              {/* ============================================
                  A. HEADER DE ÉXITO
                  ============================================ */}
              <div className="text-center space-y-5">
                {/* Animated Check */}
                <div className="flex justify-center">
                  <AnimatedCheck />
                </div>

                {/* Status */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <p className="text-[13px] font-medium" style={{ color: '#8E8E93' }}>
                    Pedido recibido
                  </p>

                  {/* Order Number — GIGANTIC */}
                  <motion.h1
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring', damping: 20, stiffness: 300 }}
                    className="text-[64px] font-black text-white leading-none tracking-tighter"
                  >
                    #{displayNumber}
                  </motion.h1>
                </motion.div>

                {/* Status Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-2 flex-wrap"
                >
                  <span className="flex items-center gap-1.5 bg-white/[0.06] text-[#5AC8FA] text-[12px] font-medium px-3 py-1.5 rounded-full border border-white/[0.04]">
                    <Clock className="w-3 h-3" />
                    10-15 min
                  </span>
                  <span className="flex items-center gap-1.5 bg-[#5AC8FA]/[0.08] text-[#5AC8FA] text-[12px] font-medium px-3 py-1.5 rounded-full border border-[#5AC8FA]/[0.12]">
                    <MapPin className="w-3 h-3" />
                    {orderMode === 'dine_in' ? 'Para comer aquí' : 'Domicilio'}
                  </span>
                </motion.div>
              </div>

              {/* ============================================
                  B. RESUMEN DEL PEDIDO — Bento Receipt
                  ============================================ */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="rounded-[24px] overflow-hidden border border-white/[0.06]"
                style={{ background: '#1C1C1E' }}
              >
                <div className="px-5 pt-4 pb-5 space-y-3">
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase" style={{ color: '#8E8E93' }}>
                    Tu Pedido
                  </p>

                  {/* Items */}
                  <div className="space-y-2.5">
                    {items.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 + i * 0.05 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-white/60 font-medium">
                            {item.quantity}x
                          </span>
                          <span className="text-[13px] text-white">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-[13px] text-white/60 font-mono tabular-nums">
                          {formatPrice(item.price)}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-white/[0.06] pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] font-bold text-white">Total</span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, type: 'spring' }}
                        className="text-[20px] font-black text-cholesterol-yellow tabular-nums"
                      >
                        {formatPrice(total)}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Footer */}
                <div className="px-5 py-3 border-t border-white/[0.04] bg-white/[0.02]">
                  <p className="text-[11px]" style={{ color: '#8E8E93' }}>
                    Pago: <span className="text-white/60 font-medium">{PAYMENT_LABELS[paymentMethod]}</span>
                  </p>
                </div>
              </motion.div>

              {/* ============================================
                  C. BOTONERA DE ACCIÓN
                  ============================================ */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="space-y-3"
              >
                {/* Primary — Track Order */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleTrackOrder}
                  className="w-full py-4 rounded-[18px] text-[16px] font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: '#FFC700',
                    color: '#000000',
                    boxShadow: '0 2px 20px rgba(255,199,0,0.2)',
                  }}
                >
                  Ver estado de mi pedido
                  <ArrowRight className="w-4 h-4" />
                </motion.button>

                {/* Secondary — New Order */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNewOrder}
                  className="w-full py-4 rounded-[18px] text-[16px] font-semibold flex items-center justify-center gap-2 bg-[#2C2C2E] text-white transition-all hover:bg-[#3A3A3C]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Hacer otro pedido
                </motion.button>

                {/* WhatsApp Support */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleWhatsAppSupport}
                  className="w-full py-3.5 rounded-[18px] text-[14px] font-medium flex items-center justify-center gap-2 bg-transparent text-[#32D74B] transition-all border border-[#32D74B]/20 hover:bg-[#32D74B]/[0.05]"
                >
                  <MessageCircle className="w-4 h-4" />
                  ¿Algún problema? Escríbenos
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
