import type { WishlistItemDto } from "@repo/types/contracts";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  count: number;
  ids: string[];
  items: WishlistItemDto[];
  previousCount: number;
  previousIds: string[];
  previousItems: WishlistItemDto[];
  hasHydrated: boolean;

  hydrate: (items: WishlistItemDto[]) => void;
  setHasHydrated: (hydrated: boolean) => void;
  addItem: (item: WishlistItemDto) => void;
  remove: (productId: string) => void;
  clear: () => void;
  has: (productId: string) => boolean;
  rollback: () => void;
};

export const useWishlistState = create<WishlistState>()(
  persist(
    (set, get) => ({
      count: 0,
      ids: [],
      items: [],
      previousCount: 0,
      previousIds: [],
      previousItems: [],
      hasHydrated: false,

      hydrate: (items) => {
        const ids = items.map((item) => item.product.id);
        set({
          count: items.length,
          ids,
          items,
          previousCount: items.length,
          previousIds: ids,
          previousItems: items,
          hasHydrated: true,
        });
      },

      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),

      addItem: (item) =>
        set((state) => {
          if (state.ids.includes(item.product.id)) return state;
          return {
            previousCount: state.count,
            previousIds: state.ids,
            previousItems: state.items,
            count: state.count + 1,
            ids: [...state.ids, item.product.id],
            items: [...state.items, item],
          };
        }),

      remove: (productId) =>
        set((state) => {
          if (!state.ids.includes(productId)) return state;
          return {
            previousCount: state.count,
            previousIds: state.ids,
            previousItems: state.items,
            count: state.count - 1,
            ids: state.ids.filter((id) => id !== productId),
            items: state.items.filter((item) => item.product.id !== productId),
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

      has: (productId) => get().ids.includes(productId),

      rollback: () =>
        set((state) => ({
          count: state.previousCount,
          ids: state.previousIds,
          items: state.previousItems,
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
