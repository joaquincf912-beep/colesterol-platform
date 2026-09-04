'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Flame, UtensilsCrossed, Sandwich, Salad, CupSoda, IceCreamCone, Target } from 'lucide-react';
import type { ProductCategory } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface NavigationRailProps {
  activeCategory: ProductCategory | 'all';
  onCategorySelect: (category: ProductCategory | 'all') => void;
  onBack: () => void;
  cartCount: number;
  onCartOpen: () => void;
  orderMode: 'dine_in' | 'delivery';
}

const NAV_ITEMS: { id: ProductCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'appetizers', label: 'Entradas' },
  { id: 'sides', label: 'Acomp.' },
  { id: 'drinks', label: 'Bebidas' },
  { id: 'desserts', label: 'Postres' },
  { id: 'combos', label: 'Combos' },
];

export default function NavigationRail({
  activeCategory,
  onCategorySelect,
  onBack,
  cartCount,
  onCartOpen,
  orderMode,
}: NavigationRailProps) {
  return (
    <nav className="h-full flex flex-col items-center py-4 px-1 relative z-20"
      style={{
        width: '80px',
        minWidth: '80px',
        background: 'rgba(22, 22, 24, 0.95)',
        backdropFilter: 'blur(40px) saturate(200%)',
        WebkitBackdropFilter: 'blur(40px) saturate(200%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-colors mb-4 active:scale-90"
      >
        <ArrowLeft className="w-4 h-4 text-white/60" />
      </button>

      {/* Logo Mark */}
      <div className="w-10 h-10 rounded-full bg-cholesterol-yellow flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,199,0,0.2)]">
        <span className="text-sm font-black text-black">C</span>
      </div>

      {/* Category Icons — Scrollable Middle */}
      <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto scrollbar-hide py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = activeCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onCategorySelect(item.id)}
              className={cn(
                'relative w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 group',
                isActive
                  ? 'bg-cholesterol-yellow/10'
                  : 'hover:bg-white/[0.04]'
              )}
              title={item.label}
            >
              {/* Active Indicator — Vertical Yellow Bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cholesterol-yellow rounded-r-full"
                  transition={{ type: 'spring', damping: 25, stiffness: 350, mass: 0.8 }}
                />
              )}

              {/* Icon */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                {item.id === 'all' && <Flame className="w-4 h-4" />}
                {item.id === 'burgers' && <UtensilsCrossed className="w-4 h-4" />}
                {item.id === 'appetizers' && <Sandwich className="w-4 h-4" />}
                {item.id === 'sides' && <Salad className="w-4 h-4" />}
                {item.id === 'drinks' && <CupSoda className="w-4 h-4" />}
                {item.id === 'desserts' && <IceCreamCone className="w-4 h-4" />}
                {item.id === 'combos' && <Target className="w-4 h-4" />}
              </motion.div>

              {/* Label */}
              <span className={cn(
                'text-[8px] font-medium leading-none transition-colors duration-200',
                isActive ? 'text-cholesterol-yellow' : 'text-white/30 group-hover:text-white/50'
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bottom Section — Cart + WhatsApp */}
      <div className="flex flex-col items-center gap-3 mt-2">
        {/* Cart Button */}
        <button
          onClick={onCartOpen}
          className={cn(
            'relative w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300',
            cartCount > 0
              ? 'bg-cholesterol-yellow text-black shadow-[0_0_20px_rgba(255,199,0,0.25)]'
              : 'bg-white/[0.06] text-white/40 hover:bg-white/[0.1]'
          )}
        >
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-cholesterol-red text-white text-[9px] font-bold rounded-full flex items-center justify-center"
            >
              {cartCount}
            </motion.span>
          )}
        </button>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573026456024'}?text=${encodeURIComponent(
            orderMode === 'delivery'
              ? '¡Hola! Quiero hacer un pedido a domicilio'
              : '¡Hola! Quiero hacer un pedido para comer en el local'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_0_15px_rgba(37,211,102,0.3)] hover:scale-110 transition-transform duration-300"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </nav>
  );
}
