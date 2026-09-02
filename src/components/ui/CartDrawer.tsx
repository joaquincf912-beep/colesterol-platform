'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '@/stores/cart';
import { formatPrice, cn } from '@/lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCart();

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
            className="fixed inset-0 z-40 backdrop-blur-overlay"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 340, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[88vh] overflow-hidden flex flex-col"
            style={{
              background: 'rgba(22, 22, 24, 0.95)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'clamp(16px, env(safe-area-inset-bottom, 0px) + 16px, 22px) 22px 0 0',
              boxShadow: '0 -4px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            {/* iOS Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-white/20 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-cholesterol-yellow" />
                <h2 className="text-lg font-bold text-white">
                  Tu Pedido
                </h2>
                <span className="bg-cholesterol-yellow text-black text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {getItemCount()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-white/30 hover:text-cholesterol-red transition-colors font-medium"
                  >
                    Vaciar
                  </button>
                )}
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/[0.1] transition-colors">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-white/25">
                  <ShoppingBag className="w-14 h-14 mb-3 opacity-40" />
                  <p className="text-sm font-medium">Tu carrito está vacío</p>
                  <p className="text-xs text-white/15 mt-1">Agrega algo del menú</p>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemRow
                    key={`${item.product.id}-${JSON.stringify(item.customizations)}`}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-4 border-t border-white/[0.05] pb-safe">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/40 text-sm">Total</span>
                  <span className="text-xl font-bold text-cholesterol-yellow">
                    {formatPrice(getTotal())}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onCheckout();
                  }}
                  className="btn-primary w-full text-center py-4 text-[15px]"
                >
                  Proceder al Checkout →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: ReturnType<typeof useCart.getState>['items'][0];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16, height: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-white/[0.04] rounded-[14px] p-3.5 border border-white/[0.04]"
    >
      <div className="flex items-start gap-3">
        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-white text-sm truncate">{item.product.name}</h4>
          <p className="text-[11px] text-white/30 mt-0.5">{formatPrice(item.product.price)} c/u</p>

          {/* Customizations */}
          {Object.keys(item.customizations).length > 0 && (
            <div className="mt-1.5 space-y-0.5">
              {Object.entries(item.customizations).map(([group, value]) => (
                <p key={group} className="text-[10px] text-white/25">
                  {group}: {Array.isArray(value) ? value.join(', ') : value}
                </p>
              ))}
            </div>
          )}

          {/* Removed ingredients */}
          {item.removed_ingredients.length > 0 && (
            <p className="text-[10px] text-cholesterol-red/50 mt-1">
              Sin: {item.removed_ingredients.join(', ')}
            </p>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.04]">
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/[0.06] transition-colors"
            >
              {item.quantity === 1 ? (
                <Trash2 className="w-3 h-3 text-cholesterol-red" />
              ) : (
                <Minus className="w-3 h-3 text-white/40" />
              )}
            </button>
            <span className="w-5 text-center text-xs font-bold text-white">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center hover:bg-white/[0.06] transition-colors"
            >
              <Plus className="w-3 h-3 text-white/40" />
            </button>
          </div>

          {/* Item Total */}
          <span className="text-xs font-bold text-cholesterol-yellow">
            {formatPrice(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
