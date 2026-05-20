"use client";
import { useEffect } from "react";

import { getCart } from "@/shared/actions/cart/getCart";
import { useAuthState } from "@/shared/states/auth";
import { useCartState } from "@/shared/states/cart";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

export const CartProvider = () => {
  const { hydrate } = useCartState();
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadCart = async () => {
      const { data } = await authenticatedAction(getCart);
      if (data?.cart) {
        hydrate({
          items: data.cart.items,
          summary: data.cart.summary,
        });
      }
    };

    loadCart();
  }, [hydrate, isAuthenticated]);

  return null;
};
