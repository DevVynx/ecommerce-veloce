"use client";
import { useEffect } from "react";

import { getCart } from "@/shared/actions/cart/getCart";
import { syncCart } from "@/shared/actions/cart/syncCart";
import { useAuthState } from "@/shared/states/auth";
import { useCartState } from "@/shared/states/cart";

export const CartProvider = () => {
  const { hydrate } = useCartState();
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCart = async () => {
      const { cart } = useCartState.getState();
      const hasUnsynced = cart.items.some((item) => item.id.startsWith("temp-"));

      if (hasUnsynced) {
        const unsyncedItems = cart.items
          .filter((item) => item.id.startsWith("temp-"))
          .map((item) => ({
            productVariantId: item.product.variant.id,
            quantity: item.quantity,
          }));

        const { data } = await syncCart({ items: unsyncedItems });
        if (!data?.cart) {
          hydrate({ items: [], summary: { count: 0, discount: 0, subtotal: 0, total: 0 } });
          return;
        }

        hydrate({ items: data.cart.items, summary: data.cart.summary });
      }

      const { data } = await getCart();
      if (!data?.cart) {
        hydrate({ items: [], summary: { count: 0, discount: 0, subtotal: 0, total: 0 } });
        return;
      }

      hydrate({ items: data.cart.items, summary: data.cart.summary });
    };

    loadCart();
  }, [hydrate, isAuthenticated]);

  return null;
};
