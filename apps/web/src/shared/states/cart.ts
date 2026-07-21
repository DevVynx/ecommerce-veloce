import type { CartDto, CartItemDto, CouponType } from "@repo/types/contracts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { calculateSummary } from "@/shared/utils/store/calculateSummary";

type AppliedCouponData = {
  code: string;
  discount: number;
  description: string;
  type: CouponType;
};

type CartState = {
  cart: Omit<CartDto, "id">;
  previousCart: Omit<CartDto, "id">;
  hasHydrated: boolean;
  appliedCoupon: AppliedCouponData | null;

  hydrate: (cart: { items: CartItemDto[]; summary: CartDto["summary"] }) => void;
  setHasHydrated: (hydrated: boolean) => void;
  addItem: (item: CartItemDto) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  updateItemId: (oldId: string, newId: string) => void;
  updateItemStock: (cartItemId: string, stock: number) => void;
  clear: () => void;
  rollback: () => void;
  setCoupon: (coupon: AppliedCouponData | null) => void;
  clearCoupon: () => void;
};

const emptyCart = {
  items: [] as CartItemDto[],
  summary: { count: 0, subtotal: 0, total: 0, discount: 0 },
};

export const useCartState = create<CartState>()(
  persist(
    (set, _get) => ({
      cart: emptyCart,
      previousCart: emptyCart,
      hasHydrated: false,
      appliedCoupon: null,

      hydrate: (freshCart) =>
        set({
          cart: freshCart,
          previousCart: freshCart,
          hasHydrated: true,
        }),

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      addItem: (newItem) =>
        set((state) => {
          const existingIndex = state.cart.items.findIndex(
            (item) => item.product.variant.id === newItem.product.variant.id
          );

          let updatedItems: CartItemDto[];
          if (existingIndex >= 0 && state.cart.items[existingIndex]) {
            const existingItem = state.cart.items[existingIndex];
            updatedItems = [...state.cart.items];
            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: existingItem.quantity + newItem.quantity,
            };
          } else {
            updatedItems = [...state.cart.items, newItem];
          }

          return {
            previousCart: state.cart,
            cart: { items: updatedItems, summary: calculateSummary(updatedItems) },
          };
        }),

      removeItem: (cartItemId) =>
        set((state) => {
          const updatedItems = state.cart.items.filter((item) => item.id !== cartItemId);
          return {
            previousCart: state.cart,
            cart: { items: updatedItems, summary: calculateSummary(updatedItems) },
          };
        }),

      updateQuantity: (cartItemId, quantity) =>
        set((state) => {
          const updatedItems = state.cart.items.map((item) =>
            item.id === cartItemId ? { ...item, quantity } : item
          );
          return {
            previousCart: state.cart,
            cart: { items: updatedItems, summary: calculateSummary(updatedItems) },
          };
        }),

      clear: () =>
        set({
          cart: emptyCart,
          previousCart: emptyCart,
        }),

      updateItemId: (oldId, newId) =>
        set((state) => {
          const index = state.cart.items.findIndex((item) => item.id === oldId);
          if (index === -1) return state;

          const item = state.cart.items[index];
          if (!item) return state;

          const updatedItems = [...state.cart.items];
          updatedItems[index] = { ...item, id: newId };

          return {
            cart: { items: updatedItems, summary: calculateSummary(updatedItems) },
          };
        }),

      updateItemStock: (cartItemId, stock) =>
        set((state) => {
          const updatedItems = state.cart.items.map((item) =>
            item.id === cartItemId
              ? {
                  ...item,
                  product: {
                    ...item.product,
                    variant: { ...item.product.variant, stock },
                  },
                }
              : item
          );
          return { cart: { ...state.cart, items: updatedItems } };
        }),

      rollback: () =>
        set((state) => ({
          cart: state.previousCart,
        })),

      setCoupon: (coupon) => set({ appliedCoupon: coupon }),

      clearCoupon: () => set({ appliedCoupon: null }),
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        cart: state.cart,
        previousCart: state.previousCart,
        hasHydrated: state.hasHydrated,
      }),
    }
  )
);
