'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Clock } from 'lucide-react';
import type { Product, ProductCategory } from '@/types';
import { CATEGORY_LABELS } from '@/types';
import { formatPrice, cn } from '@/lib/utils';

interface ProductCanvasProps {
  products: Product[];
  isLoading: boolean;
  onProductClick: (product: Product) => void;
  onCategoryInView: (category: ProductCategory | 'all') => void;
  activeCategory: ProductCategory | 'all';
}

// Category display order
const CATEGORY_ORDER: ProductCategory[] = ['burgers', 'appetizers', 'sides', 'drinks', 'desserts', 'combos'];

export default function ProductCanvas({
  products,
  isLoading,
  onProductClick,
  onCategoryInView,
  activeCategory,
}: ProductCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingFromClick = useRef(false);

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups: Record<ProductCategory, Product[]> = {
      burgers: [], appetizers: [], sides: [], drinks: [], desserts: [], combos: [],
    };
    products.forEach((p) => {
      if (groups[p.category]) {
        groups[p.category].push(p);
      }
    });
    return groups;
  }, [products]);

  // Categories that have products
  const activeCategories = useMemo(() => {
    return CATEGORY_ORDER.filter((cat) => groupedProducts[cat].length > 0);
  }, [groupedProducts]);

  // IntersectionObserver — detect which category is in view
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingFromClick.current) return;

        // Find the most visible section
        let maxRatio = 0;
        let visibleCategory: ProductCategory | 'all' = 'all';

        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            const cat = entry.target.getAttribute('data-category') as ProductCategory;
            if (cat) visibleCategory = cat;
          }
        });

        if (maxRatio > 0.1) {
          onCategoryInView(visibleCategory);
        }
      },
      {
        root: canvas,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.1, 0.3, 0.5],
      }
    );

    // Observe all category sections
    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [products, onCategoryInView]);

  // Scroll to category section
  const scrollToCategory = useCallback((category: ProductCategory | 'all') => {
    if (category === 'all') {
      canvasRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const section = sectionRefs.current.get(category);
    if (section && canvasRef.current) {
      isScrollingFromClick.current = true;
      const containerTop = canvasRef.current.getBoundingClientRect().top;
      const sectionTop = section.getBoundingClientRect().top;
      const offset = sectionTop - containerTop + canvasRef.current.scrollTop - 16;

      canvasRef.current.scrollTo({ top: offset, behavior: 'smooth' });

      // Re-enable IntersectionObserver after scroll completes
      setTimeout(() => {
        isScrollingFromClick.current = false;
      }, 800);
    }
  }, []);

  // Expose scrollToCategory via a global-like approach
  useEffect(() => {
    (window as any).__scrollToCategory = scrollToCategory;
    return () => {
      delete (window as any).__scrollToCategory;
    };
  }, [scrollToCategory]);

  // Register section ref
  const setSectionRef = useCallback((category: string) => (el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(category, el);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={canvasRef}
      className="flex-1 overflow-y-auto overflow-x-hidden"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Top Header Area */}
      <div className="sticky top-0 z-10 px-5 pt-5 pb-3"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 60%, transparent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <h2 className="text-[13px] text-white/30 tracking-[0.15em] uppercase font-medium">
          ¿Qué quieres hoy?
        </h2>
      </div>

      {/* Category Sections */}
      <div className="px-4 pb-32 space-y-6">
        {activeCategories.map((category) => {
          const categoryProducts = groupedProducts[category];
          if (categoryProducts.length === 0) return null;

          return (
            <div
              key={category}
              ref={setSectionRef(category)}
              data-category={category}
            >
              {/* Sticky Category Header */}
              <div className="sticky top-[44px] z-10 py-2 px-1 mb-3"
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.95) 70%, transparent)',
                }}
              >
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">
                    {CATEGORY_LABELS[category]}
                  </h3>
                  <span className="text-[10px] text-white/20 font-medium bg-white/[0.04] px-2 py-0.5 rounded-full">
                    {categoryProducts.length}
                  </span>
                </div>
              </div>

              {/* Bento Grid — 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                {categoryProducts.map((product, i) => (
                  <BentoCard
                    key={product.id}
                    product={product}
                    index={i}
                    onClick={() => onProductClick(product)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// BENTO CARD — Apple-style Product Card
// ============================================
function BentoCard({
  product,
  index,
  onClick,
}: {
  product: Product;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.06, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div
        className="relative overflow-hidden transition-all duration-300 group-active:scale-[0.97]"
        style={{
          background: '#000000',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 2px 20px rgba(0, 0, 0, 0.4)',
        }}
      >
        {/* Image — 1:1 Aspect Ratio */}
        <div className="relative aspect-square overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-[#1C1C1E] flex items-center justify-center text-lg font-bold text-white/20 tracking-tight">
              {product.name.charAt(0)}
            </div>
          )}

          {/* Deep shadow overlay for Apple product photography feel */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

          {/* Featured Badge */}
          {product.is_featured && (
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-cholesterol-yellow text-black text-[9px] font-bold px-2 py-0.5 rounded-full">
                ★ Popular
              </span>
            </div>
          )}

          {/* Prep Time */}
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-black/50 backdrop-blur-md text-white/60 text-[9px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {product.prep_time_minutes}min
            </span>
          </div>

          {/* Add Button — Bottom Right */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-cholesterol-yellow flex items-center justify-center shadow-[0_2px_12px_rgba(255,199,0,0.35)] opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <Plus className="w-5 h-5 text-black" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-3">
          <h4 className="font-bold text-[13px] text-white leading-tight line-clamp-1">
            {product.name}
          </h4>
          {product.description && (
            <p className="text-[11px] leading-relaxed line-clamp-2 mt-0.5"
              style={{ color: '#8E8E93' }}
            >
              {product.description}
            </p>
          )}
          <p className="text-[14px] font-bold text-cholesterol-yellow mt-2 tabular-nums"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
