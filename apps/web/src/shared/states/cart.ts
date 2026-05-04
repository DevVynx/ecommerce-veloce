import type { CartItemDto } from "@repo/types/contracts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  count: number;
  ids: string[];
  items: CartItemDto[];
  previousCount: number;
  previousIds: string[];
  previousItems: CartItemDto[];
  hasHydrated: boolean;

  hydrate: (cart: { items: CartItemDto[]; count: number }) => void;
  setHasHydrated: (hydrated: boolean) => void;
  addItem: (item: CartItemDto) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateItemId: (oldId: string, newId: string) => void;
  clear: () => void;
  rollback: () => void;
};

export const useCartState = create<CartState>()(
  persist(
    (set, _get) => ({
      count: 0,
      ids: [],
      items: [],
      previousCount: 0,
      previousIds: [],
      previousItems: [],
      hasHydrated: false,

      hydrate: (cart) => {
        const ids = cart.items.map((item) => item.id);
        set({
          count: cart.count,
          ids,
          items: cart.items,
          previousCount: cart.count,
          previousIds: ids,
          previousItems: cart.items,
          hasHydrated: true,
        });
      },

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      addItem: (newItem) =>
        set((state) => {
          // Busca por variantId (product.variant.id) em vez de cart item id
          const existingIndex = state.items.findIndex(
            (item) => item.product.variant.id === newItem.product.variant.id
          );
          let updatedItems: CartItemDto[];

          if (existingIndex >= 0 && state.items[existingIndex]) {
            const existingItem = state.items[existingIndex];
            updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + newItem.quantity,
            };
          } else {
            updatedItems = [...state.items, newItem];
          }

          const ids = updatedItems.map((item) => item.id);
          return {
            previousCount: state.count,
            previousIds: state.ids,
            previousItems: state.items,
            count: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            ids,
            items: updatedItems,
          };
        }),

      removeItem: (cartItemId) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== cartItemId);
          const ids = updatedItems.map((item) => item.id);
          return {
            previousCount: state.count,
            previousIds: state.ids,
            previousItems: state.items,
            count: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            ids,
            items: updatedItems,
          };
        }),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          );
          const ids = updatedItems.map((item) => item.id);
          return {
            previousCount: state.count,
            previousIds: state.ids,
            previousItems: state.items,
            count: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
            ids,
            items: updatedItems,
          };
        }),

      clear: () =>
        set({
          count: 0,
          ids: [],
          items: [],
          previousCount: 0,
          previousIds: [],
          previousItems: [],
        }),

      updateItemId: (oldId, newId) =>
        set((state) => {
          const index = state.items.findIndex((item) => item.id === oldId);
          if (index === -1) return state;

          const item = state.items[index];
          if (!item) return state;

          const updatedItems = [...state.items];
          updatedItems[index] = { ...item, id: newId };

          return {
            ...state,
            items: updatedItems,
            ids: updatedItems.map((item) => item.id),
          };
        }),

      rollback: () =>
        set((state) => ({
          count: state.previousCount,
          ids: state.previousIds,
          items: state.previousItems,
        })),
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        count: state.count,
        ids: state.ids,
        items: state.items,
        hasHydrated: state.hasHydrated,
      }),
    }
  )
);
