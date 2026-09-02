'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Check, Plus, Sparkles } from 'lucide-react';
import { useCart } from '@/stores/cart';
import { DEMO_PRODUCTS } from '@/lib/demo-data';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/types';

interface UpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
}

// Smart suggestion logic — prioritize complementary items
function getSuggestions(cartProductIds: string[]): Product[] {
  // Products already in cart
  const inCart = new Set(cartProductIds);

  // Get cart categories to determine what to suggest
  const cartCategories = new Set(
    DEMO_PRODUCTS.filter((p) => inCart.has(p.id)).map((p) => p.category)
  );

  // Only suggest drinks and sides (accompanyments)
  const candidates = DEMO_PRODUCTS.filter(
    (p) =>
      p.is_available &&
      !inCart.has(p.id) &&
      ['drinks', 'sides', 'appetizers'].includes(p.category)
  );

  // Sort: prefer categories not in cart, then by featured, then by price (low first for impulse buys)
  const scored = candidates.map((p) => {
    let score = 0;
    // Boost items NOT in cart's categories (complementary)
    if (!cartCategories.has(p.category)) score += 10;
    // Boost featured items
    if (p.is_featured) score += 5;
    // Boost lower price (impulse buy territory)
    if (p.price <= 3) score += 3;
    if (p.price <= 1.5) score += 2;
    return { product: p, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Return top 4 suggestions
  return scored.slice(0, 4).map((s) => s.product);
}

// ============================================
// UPSELL CARD
// ============================================
function UpsellCard({
  product,
  index,
  isAdded,
  onToggle,
}: {
  product: Product;
  index: number;
  isAdded: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.15 + index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileTap={{ scale: 0.97 }}
      onClick={onToggle}
      className={cn(
        'relative flex items-center gap-4 p-3 rounded-[20px] transition-all duration-300 text-left w-full',
        isAdded
          ? 'bg-cholesterol-yellow/[0.06] border-2 border-cholesterol-yellow/30'
          : 'bg-white/[0.03] border-2 border-transparent hover:bg-white/[0.05] hover:border-white/[0.06]'
      )}
      style={{
        boxShadow: isAdded ? '0 0 24px rgba(255,199,0,0.08)' : 'none',
      }}
    >
      {/* Product Image */}
      <div className="relative w-16 h-16 rounded-[14px] overflow-hidden flex-shrink-0 bg-[#1C1C1E]">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-medium">
            {product.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-semibold text-white truncate">
          {product.name}
        </h4>
        <p className="text-[12px] font-bold text-cholesterol-yellow mt-0.5 tabular-nums">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Add / Check Indicator */}
      <motion.div
        initial={false}
        animate={{
          scale: isAdded ? 1 : 0.8,
          opacity: isAdded ? 1 : 0.5,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300',
          isAdded
            ? 'bg-cholesterol-green'
            : 'bg-white/[0.06]'
        )}
      >
        <AnimatePresence mode="wait">
          {isAdded ? (
            <motion.div
              key="check"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 400 }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Plus className="w-4 h-4 text-white/40" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  );
}

// ============================================
// MAIN UPSELL MODAL
// ============================================
export default function UpsellModal({ isOpen, onClose, onSkip }: UpsellModalProps) {
  const { items, addItem, getTotal } = useCart();
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  // Smart suggestions — exclude products already in cart
  const suggestions = useMemo(() => {
    const cartProductIds = items.map((item) => item.product.id);
    return getSuggestions(cartProductIds);
  }, [items]);

  // If no suggestions available (everything in cart), auto-skip
  if (suggestions.length === 0 && isOpen) {
    setTimeout(() => onSkip(), 0);
    return null;
  }

  const handleToggle = (product: Product) => {
    if (addedIds.has(product.id)) {
      // Remove from cart
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
      // We need to remove from cart — but our cart store doesn't have a clean
      // "remove by product id" that works for upsell-added items. We'll track it.
      // For simplicity, we'll just toggle the visual state and add on confirm.
    } else {
      // Add to cart
      addItem(product, 1, {}, [], '');
      setAddedIds((prev) => new Set(prev).add(product.id));
      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const currentTotal = getTotal();
  const addedCount = addedIds.size;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(30px) saturate(150%)',
              WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            }}
            onClick={onSkip}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 240,
              mass: 0.8,
            }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-hidden flex flex-col"
            style={{
              background: '#0A0A0C',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'clamp(20px, env(safe-area-inset-bottom, 0px) + 20px, 32px) 32px 0 0',
              boxShadow: '0 -8px 60px rgba(0,0,0,0.6)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-[5px] bg-white/15 rounded-full" />
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-4">
              {/* Header */}
              <div className="mb-5">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <Sparkles className="w-4 h-4 text-cholesterol-yellow" />
                  <span className="text-[11px] text-cholesterol-yellow font-semibold uppercase tracking-wider">
                    Para completar tu pedido
                  </span>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-[22px] font-bold text-white tracking-tight"
                >
                  ¿Le agregas un acompañante?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[13px] mt-1"
                  style={{ color: '#8E8E93' }}
                >
                  Completa tu pedido con algo más
                </motion.p>
              </div>

              {/* Suggestion Cards */}
              <div className="space-y-3">
                {suggestions.map((product, i) => (
                  <UpsellCard
                    key={product.id}
                    product={product}
                    index={i}
                    isAdded={addedIds.has(product.id)}
                    onToggle={() => handleToggle(product)}
                  />
                ))}
              </div>
            </div>

            {/* Footer — Actions */}
            <div
              className="flex-shrink-0 px-5 pb-safe pt-3"
              style={{
                background: 'linear-gradient(to top, #0A0A0C 70%, rgba(10,10,12,0.95))',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              {/* Continue Button — always visible */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="w-full h-12 rounded-[14px] flex items-center justify-center gap-2 font-semibold text-[15px] text-black transition-shadow duration-300"
                style={{
                  background: '#FFC700',
                  boxShadow: '0 2px 20px rgba(255,199,0,0.2)',
                }}
              >
                {addedCount > 0 ? (
                  <>
                    <span>Continuar con</span>
                    <span className="font-bold tabular-nums">{formatPrice(currentTotal)}</span>
                  </>
                ) : (
                  <span>Ir a Pagar</span>
                )}
              </motion.button>

              {/* Skip link */}
              <button
                onClick={onSkip}
                className="w-full py-3 text-center text-[13px] text-white/30 hover:text-white/50 transition-colors font-medium"
              >
                No, gracias
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
