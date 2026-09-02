'use client';

import { motion } from 'framer-motion';
import type { ProductCategory } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  activeCategory: ProductCategory | 'all';
  onSelect: (category: ProductCategory | 'all') => void;
}

const categories: (ProductCategory | 'all')[] = [
  'all',
  'burgers',
  'appetizers',
  'sides',
  'drinks',
  'desserts',
  'combos',
];

export default function CategoryFilter({ activeCategory, onSelect }: CategoryFilterProps) {
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={cn(
                'relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-[12px] sm:text-sm font-medium whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'text-black'
                  : 'bg-white/[0.04] border border-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.06]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="category-pill"
                  className="absolute inset-0 bg-cholesterol-yellow rounded-full"
                  transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.8 }}
                />
              )}
              <span className="relative z-10">
                {cat === 'all' ? 'Todo' : CATEGORY_LABELS[cat]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
