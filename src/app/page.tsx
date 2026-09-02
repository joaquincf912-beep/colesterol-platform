'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { useRealtimeProducts } from '@/lib/supabase/realtime';
import { useCart } from '@/stores/cart';
import { CATEGORY_LABELS } from '@/types';
import { cn } from '@/lib/utils';
import type { Product, ProductCategory } from '@/types';
import dynamic from 'next/dynamic';
const ProductModal = dynamic(() => import('@/components/ui/ProductModal'), { ssr: false });
const CartDrawer = dynamic(() => import('@/components/ui/CartDrawer'), { ssr: false });
const Checkout = dynamic(() => import('@/components/ui/Checkout'), { ssr: false });
const UpsellModal = dynamic(() => import('@/components/ui/UpsellModal'), { ssr: false });
import WelcomeScreen from '@/components/ui/WelcomeScreen';
import NavigationRail from '@/components/menu/NavigationRail';
import ProductCanvas from '@/components/menu/ProductCanvas';
import { DEMO_PRODUCTS } from '@/lib/demo-data';


type OrderMode = 'dine_in' | 'delivery' | null;

const pageVariants = {
  initial: { opacity: 0, x: 80, scale: 0.96 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -60,
    scale: 0.96,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  },
};

export default function MenuPage() {
  const [orderMode, setOrderMode] = useState<OrderMode>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory | 'all'>('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { getItemCount, getTotal } = useCart();
  const [cartCount, setCartCount] = useState(0);

  // Keep cart count in sync
  useEffect(() => {
    const interval = setInterval(() => {
      setCartCount(getItemCount());
    }, 500);
    return () => clearInterval(interval);
  }, [getItemCount]);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = getSupabaseClient();
        const { data } = await supabase
          .from('products')
          .select('*')
          .eq('is_available', true)
          .order('sort_order', { ascending: true });

        if (data && data.length > 0) {
          setProducts(data as Product[]);
        } else {
          setProducts(DEMO_PRODUCTS);
        }
      } catch {
        setProducts(DEMO_PRODUCTS);
      }
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  // Real-time product updates
  useRealtimeProducts(({ eventType, new: newProduct, old }) => {
    if (eventType === 'UPDATE') {
      setProducts((prev) =>
        prev.map((p) => (p.id === newProduct.id ? newProduct : p))
      );
      if (!newProduct.is_available) {
        setProducts((prev) => prev.filter((p) => p.id !== newProduct.id));
      }
    }
    if (eventType === 'INSERT' && newProduct.is_available) {
      setProducts((prev) => [...prev, newProduct]);
    }
    if (eventType === 'DELETE' && old) {
      setProducts((prev) => prev.filter((p) => p.id !== old.id));
    }
  });

  const handleModeSelect = useCallback((mode: OrderMode) => {
    setOrderMode(mode);
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setOrderMode(null);
    setActiveCategory('all');
    setSelectedProduct(null);
    setIsCartOpen(false);
    setIsUpsellOpen(false);
    setIsCheckoutOpen(false);
  }, []);

  // Sidebar category tap → scroll canvas to section
  const handleCategorySelect = useCallback((category: ProductCategory | 'all') => {
    setActiveCategory(category);
    // Trigger scroll in canvas via exposed function
    const scrollTo = (window as any).__scrollToCategory;
    if (scrollTo) {
      scrollTo(category);
    }
  }, []);

  // IntersectionObserver reports which category is in view
  const handleCategoryInView = useCallback((category: ProductCategory | 'all') => {
    setActiveCategory(category);
  }, []);

  return (
    <LayoutGroup>
      <AnimatePresence mode="wait">
        {/* ================================================
            WELCOME SCREEN
            ================================================ */}
        {!orderMode && (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 1, 1] }}
          >
            <WelcomeScreen onSelect={handleModeSelect} />
          </motion.div>
        )}

        {/* ================================================
            MENU VIEW — Sidebar + Canvas Layout (Desktop) / TopBar (Mobile)
            ================================================ */}
        {orderMode && (
          <motion.div
            key="menu"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-screen w-screen overflow-hidden flex flex-col bg-black"
          >
            {/* Mobile Top Bar */}
            <div className="lg:hidden flex flex-col border-b border-white/5" style={{ background: 'rgba(22,22,24,0.95)', backdropFilter: 'blur(40px)' }}>
              <div className="flex items-center justify-between px-4 py-3">
                <button onClick={handleBackToWelcome} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/[0.06]">
                  <ArrowLeft className="w-4 h-4 text-white/60" />
                </button>
                <div className="w-8 h-8 rounded-full bg-[#FFC700] flex items-center justify-center shadow-[0_0_15px_rgba(255,199,0,0.2)]">
                  <span className="text-xs font-black text-black">C</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsCartOpen(true)} className="relative w-9 h-9 rounded-full bg-white/[0.06] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-white/60" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
                    )}
                  </button>
                </div>
              </div>
              {/* Horizontal Category Scroll */}
              <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 -mx-1 px-1 scrollbar-hide">
                {(['all', 'burgers', 'appetizers', 'sides', 'drinks', 'desserts', 'combos'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0',
                      activeCategory === cat
                        ? 'bg-[#FFC700] text-black'
                        : 'bg-white/5 text-white/50'
                    )}
                  >
                    {cat === 'all' ? 'Todos' : CATEGORY_LABELS[cat]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Navigation Rail (Left Sidebar) — Desktop only */}
              <div className="hidden lg:block">
                <NavigationRail
                  activeCategory={activeCategory}
                  onCategorySelect={handleCategorySelect}
                  onBack={handleBackToWelcome}
                  cartCount={cartCount}
                  onCartOpen={() => setIsCartOpen(true)}
                  orderMode={orderMode}
                />
              </div>

              {/* Product Canvas (Right Panel) */}
              <ProductCanvas
                products={products}
                isLoading={isLoading}
                onProductClick={setSelectedProduct}
                onCategoryInView={handleCategoryInView}
                activeCategory={activeCategory}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================
          MODALS — Rendered outside layout for proper z-index
          ================================================ */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsUpsellOpen(true);
        }}
      />

      <UpsellModal
        isOpen={isUpsellOpen}
        onClose={() => {
          setIsUpsellOpen(false);
          setIsCheckoutOpen(true);
        }}
        onSkip={() => {
          setIsUpsellOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        orderMode={orderMode || 'delivery'}
      />
    </LayoutGroup>
  );
}
