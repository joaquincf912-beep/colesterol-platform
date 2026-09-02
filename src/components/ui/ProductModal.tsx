'use client';

import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Check, Clock, ChevronDown } from 'lucide-react';
import type { Product, OrderItemCustomizations, CustomizationGroup } from '@/types';
import { useCart } from '@/stores/cart';
import { formatPrice, cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

// ============================================
// ANIMATED PRICE COUNTER
// ============================================
function AnimatedPrice({ value }: { value: number }) {
  const motionVal = useMotionValue(value);
  const display = useTransform(motionVal, (v) => formatPrice(v));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [value, motionVal]);

  return <motion.span ref={ref}>{display}</motion.span>;
}

// ============================================
// INGREDIENT PILL
// ============================================
function IngredientPill({
  name,
  isRemoved,
  onToggle,
}: {
  name: string;
  isRemoved: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      layout
      whileTap={{ scale: 0.93 }}
      onClick={onToggle}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-medium transition-colors duration-300 select-none',
        isRemoved
          ? 'bg-white/[0.03] text-white/25 border border-white/[0.04]'
          : 'bg-white/[0.07] text-white border border-white/[0.08] hover:bg-white/[0.1]'
      )}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isRemoved ? 0 : 1,
          opacity: isRemoved ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute left-2.5"
      >
        <div className="w-4 h-4 rounded-full bg-cholesterol-green/20 flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-cholesterol-green" strokeWidth={3} />
        </div>
      </motion.div>

      <motion.span
        animate={{
          x: isRemoved ? 0 : 10,
          opacity: isRemoved ? 1 : 0.7,
          textDecoration: isRemoved ? 'line-through' : 'none',
        }}
        transition={{ duration: 0.25 }}
        className={isRemoved ? 'pl-0' : 'pl-6'}
      >
        {name}
      </motion.span>

      {isRemoved && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="text-cholesterol-red/50 text-xs ml-1"
        >
          ✕
        </motion.span>
      )}
    </motion.button>
  );
}

// ============================================
// CUSTOMIZATION OPTION (Apple Checkbox / Radio)
// ============================================
function CustomizationOption({
  group,
  option,
  isSelected,
  onToggle,
}: {
  group: CustomizationGroup;
  option: { name: string; price: number };
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={cn(
        'w-full flex items-center gap-3.5 p-3.5 rounded-[14px] transition-all duration-200 text-left',
        isSelected
          ? 'bg-cholesterol-yellow/[0.07] border border-cholesterol-yellow/20'
          : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.05]'
      )}
    >
      {/* Apple Radio / Checkbox */}
      <div className={cn(
        'w-[20px] h-[20px] rounded-full border-[2px] flex items-center justify-center transition-all duration-300 flex-shrink-0',
        isSelected
          ? 'bg-cholesterol-yellow border-cholesterol-yellow'
          : 'border-white/20'
      )}
        style={{
          boxShadow: isSelected ? '0 0 12px rgba(255,199,0,0.3)' : 'none',
        }}
      >
        <motion.div
          initial={false}
          animate={{
            scale: isSelected ? 1 : 0,
            opacity: isSelected ? 1 : 0,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 400 }}
        >
          {group.type === 'single' ? (
            <div className="w-2 h-2 rounded-full bg-black" />
          ) : (
            <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
          )}
        </motion.div>
      </div>

      {/* Label + Price */}
      <div className="flex-1 flex items-center justify-between">
        <span className={cn(
          'text-[13px] font-medium transition-colors',
          isSelected ? 'text-white' : 'text-white/70'
        )}>
          {option.name}
        </span>
        {option.price > 0 && (
          <span className={cn(
            'text-[12px] font-medium tabular-nums transition-colors',
            isSelected ? 'text-cholesterol-yellow' : 'text-white/25'
          )}>
            +{formatPrice(option.price)}
          </span>
        )}
      </div>
    </motion.button>
  );
}

// ============================================
// MAIN PRODUCT MODAL
// ============================================
export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState<OrderItemCustomizations>({});
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const addItem = useCart((s) => s.addItem);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when product changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setCustomizations({});
      setRemovedIngredients([]);
      setNotes('');
      // Reset scroll position
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' });
      }, 50);
    }
  }, [isOpen, product?.id]);

  if (!product) return null;

  // ============================================
  // HANDLERS
  // ============================================
  const handleCustomizationChange = (group: CustomizationGroup, value: string) => {
    setCustomizations((prev) => {
      if (group.type === 'single') {
        return { ...prev, [group.name]: value };
      }
      const current = (prev[group.name] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [group.name]: updated };
    });
  };

  const toggleRemoveIngredient = (ingredient: string) => {
    setRemovedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((i) => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const handleAddToCart = () => {
    // Validate required customizations
    for (const group of product.customizations) {
      if (group.required && !customizations[group.name]) {
        toast.error(`Selecciona ${group.name}`, {
          description: 'Es una opción requerida',
        });
        // Scroll to the missing group
        return;
      }
    }

    addItem(product, quantity, customizations, removedIngredients, notes);

    // Haptic feedback (if available)
    if (navigator.vibrate) navigator.vibrate(10);

    toast.success(`${product.name} añadido`, {
      description: `${quantity}x ${formatPrice(unitTotal)}`,
      icon: '✓',
    });

    onClose();
  };

  // ============================================
  // PRICE CALCULATION
  // ============================================
  let extrasTotal = 0;
  Object.entries(customizations).forEach(([groupName, value]) => {
    const group = product.customizations.find((g) => g.name === groupName);
    if (Array.isArray(value)) {
      value.forEach((v) => {
        const option = group?.options.find((o) => o.name === v);
        if (option) extrasTotal += option.price;
      });
    } else {
      const option = group?.options.find((o) => o.name === value);
      if (option) extrasTotal += option.price;
    }
  });

  const unitTotal = product.price + extrasTotal;
  const lineTotal = unitTotal * quantity;

  // Check if product has ingredients to show
  const hasIngredients = product.ingredients_to_remove.length > 0;
  // Check if product has customizations to show
  const hasCustomizations = product.customizations.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ============================================
              BACKDROP
              ============================================ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(30px) saturate(150%)',
              WebkitBackdropFilter: 'blur(30px) saturate(150%)',
            }}
            onClick={onClose}
          />

          {/* ============================================
              BOTTOM SHEET (Mobile) / CENTERED MODAL (Desktop)
              ============================================ */}
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 35,
              stiffness: 380,
              mass: 0.8,
            }}
            className="fixed z-50 flex flex-col
              bottom-0 left-0 right-0
              sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2
              max-h-[95vh] sm:max-h-[88vh] sm:max-w-[440px] sm:w-[calc(100%-32px)]
              overflow-hidden"
            style={{
              background: '#111113',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 'clamp(20px, env(safe-area-inset-bottom, 0px) + 20px, 32px) 32px 0 0',
              boxShadow: '0 -8px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* iOS Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0 sm:hidden">
              <div className="w-10 h-[5px] bg-white/15 rounded-full" />
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-white/[0.08] backdrop-blur-xl flex items-center justify-center hover:bg-white/[0.12] transition-colors active:scale-90"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>

            {/* ============================================
                SCROLLABLE CONTENT
                ============================================ */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
              {/* ============================================
                  A. HERO — Product Image
                  ============================================ */}
              <div className="relative w-full aspect-[16/10] overflow-hidden flex-shrink-0">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 440px"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-[#1C1C1E] text-7xl">
                    {product.name.charAt(0)}
                  </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/30 to-transparent" />

                {/* Prep time badge */}
                <div className="absolute top-4 left-4">
                  <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-xl text-white/70 text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-white/[0.06]">
                    <Clock className="w-3 h-3" />
                    {product.prep_time_minutes} min
                  </span>
                </div>
              </div>

              {/* ============================================
                  B. PRODUCT INFO
                  ============================================ */}
              <div className="px-5 -mt-6 relative z-10 space-y-5">
                {/* Name + Price */}
                <div>
                  <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                    {product.name}
                  </h2>
                  {product.description && (
                    <p className="text-[13px] leading-relaxed mt-2" style={{ color: '#8E8E93' }}>
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-baseline gap-2 mt-3">
                    <span className="text-cholesterol-yellow text-[22px] font-bold tabular-nums">
                      {formatPrice(product.price)}
                    </span>
                    {extrasTotal > 0 && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-white/25 text-sm"
                      >
                        + {formatPrice(extrasTotal)} en extras
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* ============================================
                    C. "ASÍ VIENE" — Removable Ingredients
                    ============================================ */}
                {hasIngredients && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-semibold text-white">
                        Así viene
                      </h3>
                      <span className="text-[10px] text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">
                        Toca para quitar
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.ingredients_to_remove.map((ingredient) => (
                        <IngredientPill
                          key={ingredient}
                          name={ingredient}
                          isRemoved={removedIngredients.includes(ingredient)}
                          onToggle={() => toggleRemoveIngredient(ingredient)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ============================================
                    D. "AGREGA MÁS" — Customization Groups
                    ============================================ */}
                {hasCustomizations && product.customizations.map((group) => (
                  <div key={group.name} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[15px] font-semibold text-white">
                        {group.name}
                      </h3>
                      {group.required && (
                        <span className="text-[10px] text-cholesterol-yellow font-semibold uppercase tracking-wider bg-cholesterol-yellow/[0.08] px-2 py-0.5 rounded-full">
                          Requerido
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {group.options.map((option) => {
                        const isSelected =
                          group.type === 'single'
                            ? customizations[group.name] === option.name
                            : (customizations[group.name] as string[] | undefined)?.includes(option.name);

                        return (
                          <CustomizationOption
                            key={option.name}
                            group={group}
                            option={option}
                            isSelected={!!isSelected}
                            onToggle={() => handleCustomizationChange(group, option.name)}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* ============================================
                    E. NOTES
                    ============================================ */}
                <div className="space-y-2.5 pb-4">
                  <h3 className="text-[15px] font-semibold text-white">
                    Notas especiales
                  </h3>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej: Sin cebolla, poco cocida..."
                    rows={2}
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-[14px] px-4 py-3 text-[13px] text-white placeholder:text-white/15 resize-none focus:outline-none focus:border-cholesterol-yellow/15 focus:bg-white/[0.05] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* ============================================
                F. FOOTER DOCK — Quantity + CTA
                ============================================ */}
            <div className="flex-shrink-0 px-5 pb-safe pt-3"
              style={{
                background: 'linear-gradient(to top, #111113 70%, rgba(17,17,19,0.95))',
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center bg-white/[0.05] rounded-[14px] border border-white/[0.06] overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center hover:bg-white/[0.05] transition-colors active:scale-90"
                  >
                    <Minus className="w-4 h-4 text-white/50" />
                  </button>
                  <motion.span
                    key={quantity}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                    className="w-8 text-center font-bold text-white text-[15px] tabular-nums"
                  >
                    {quantity}
                  </motion.span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center hover:bg-white/[0.05] transition-colors active:scale-90"
                  >
                    <Plus className="w-4 h-4 text-white/50" />
                  </button>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  className="flex-1 h-11 rounded-[14px] flex items-center justify-center gap-2 font-semibold text-[15px] text-black transition-shadow duration-300"
                  style={{
                    background: '#FFC700',
                    boxShadow: '0 2px 20px rgba(255,199,0,0.25)',
                  }}
                >
                  <span>Agregar</span>
                  <span className="font-bold">
                    <AnimatedPrice value={lineTotal} />
                  </span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
