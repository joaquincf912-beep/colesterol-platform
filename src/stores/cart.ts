import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, OrderItemCustomizations } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, customizations?: OrderItemCustomizations, removedIngredients?: string[], notes?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, customizations = {}, removedIngredients = [], notes = '') => {
        set((state) => {
          // Check if item already exists with same customizations
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              JSON.stringify(item.customizations) === JSON.stringify(customizations) &&
              JSON.stringify(item.removed_ingredients) === JSON.stringify(removedIngredients)
          );

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + quantity,
            };
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              { product, quantity, customizations, removed_ingredients: removedIngredients, notes },
            ],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          let itemTotal = item.product.price * item.quantity;

          // Add customization prices
          Object.values(item.customizations).forEach((value) => {
            if (Array.isArray(value)) {
              // Multiple selections — find prices from product customizations
              value.forEach((selected) => {
                const group = item.product.customizations.find((g) =>
                  g.options.some((o) => o.name === selected)
                );
                const option = group?.options.find((o) => o.name === selected);
                if (option) itemTotal += option.price * item.quantity;
              });
            }
          });

          return total + itemTotal;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'colesterol-cart',
    }
  )
);
