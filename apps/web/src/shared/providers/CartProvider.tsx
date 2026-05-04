"use client";
import { useEffect } from "react";

import { getCart } from "@/shared/actions/cart/getCart";
import { useCartState } from "@/shared/states/cart";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

export const CartProvider = () => {
  const { hydrate } = useCartState();

  useEffect(() => {
    const loadCart = async () => {
      const { data } = await authenticatedAction(getCart);
      if (data?.cart) {
        hydrate({
          items: data.cart.items,
          count: data.cart.summary.count,
        });
      }
    };

    loadCart();
  }, [hydrate]);

  return null;
};
