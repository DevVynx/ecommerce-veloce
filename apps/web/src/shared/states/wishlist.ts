import type { WishlistItemDto } from "@repo/types/contracts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistStore = {
  count: number;
  ids: string[];
  previousCount: number;
  previousIds: string[];
  hasHydrated: boolean;

  hydrate: (items: WishlistItemDto[]) => void;
  setHasHydrated: (hydrated: boolean) => void;
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  rollback: () => void;
};

export const useWishlistState = create<WishlistStore>()(
  persist(
    (set, get) => ({
      count: 0,
      ids: [],
      previousCount: 0,
      previousIds: [],
      hasHydrated: false,

      hydrate: (items) => {
        const ids = items.map((item) => item.product.id);
        set({
          count: items.length,
          ids,
          previousCount: items.length,
          previousIds: ids,
          hasHydrated: true,
        });
      },

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      add: (productId) =>
        set((state) => {
          if (state.ids.includes(productId)) return state;
          return {
            previousCount: state.count,
            previousIds: state.ids,
            count: state.count + 1,
            ids: [...state.ids, productId],
          };
        }),

      remove: (productId) =>
        set((state) => {
          if (!state.ids.includes(productId)) return state;
          return {
            previousCount: state.count,
            previousIds: state.ids,
            count: state.count - 1,
            ids: state.ids.filter((id) => id !== productId),
          };
        }),

      clear: () =>
        set({
          count: 0,
          ids: [],
          previousCount: 0,
          previousIds: [],
        }),

      has: (productId) => get().ids.includes(productId),

      rollback: () =>
        set((state) => ({
          count: state.previousCount,
          ids: state.previousIds,
        })),
    }),
    {
      name: "wishlist-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        count: state.count,
        ids: state.ids,
        hasHydrated: state.hasHydrated,
      }),
    }
  )
);
