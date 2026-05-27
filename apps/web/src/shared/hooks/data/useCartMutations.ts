"use client";
import type { CartItemDto } from "@repo/types/contracts";
import { useCallback, useState } from "react";

import { addItemToCart } from "@/shared/actions/cart/addItem";
import { removeItemFromCart } from "@/shared/actions/cart/removeItem";
import { updateCartItemQuantity } from "@/shared/actions/cart/updateItem";
import { useAuthState } from "@/shared/states/auth";
import { useCartState } from "@/shared/states/cart";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

export type AddItemParams = {
  productVariantId: string;
  quantity: number;
  productId: string;
  productSlug: string;
  productTitle: string;
  variantId: string;
  image: string;
  price: number;
  stock: number;
  salePrice: number;
  isOnSale: boolean;
  isAvailable: boolean;
  selectedOptions: { name: string; value: string }[];
};

export function useCartMutations() {
  const { isAuthenticated } = useAuthState();
  const { addItem, removeItem, updateQuantity, updateItemId, updateItemStock, rollback } =
    useCartState();
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;

  const addItemMutation = useCallback(
    async (params: AddItemParams) => {
      setLoadingCount((c) => c + 1);
      try {
        const tempId = `temp-${Date.now()}`;

        const existingItem = useCartState
          .getState()
          .cart.items.find((item) => item.product.variant.id === params.variantId);
        const currentQty = existingItem?.quantity ?? 0;
        const maxAddableQty = params.stock - currentQty;
        const adjustedQty = Math.min(params.quantity, maxAddableQty);

        if (adjustedQty <= 0) {
          return {
            error: { error: "", message: "Quantidade máxima disponível já atingida no carrinho." },
          };
        }

        const optimisticItem: CartItemDto = {
          id: tempId,
          quantity: adjustedQty,
          product: {
            id: params.productId,
            slug: params.productSlug,
            title: params.productTitle,
            variant: {
              id: params.variantId,
              image: params.image,
              price: params.price,
              salePrice: params.salePrice,
              stock: params.stock,
              isOnSale: params.isOnSale,
              isAvailable: params.isAvailable,
            },
          },
          selectedOptions: params.selectedOptions,
        };

        addItem(optimisticItem);

        if (!isAuthenticated) return { error: null };

        const { data, error } = await authenticatedAction(addItemToCart, {
          productVariantId: params.productVariantId,
          quantity: adjustedQty,
        });

        if (error) {
          rollback();
          return { error };
        }

        if (data?.cartItem) {
          const { cartItem } = data;
          updateItemId(tempId, cartItem.id);

          if (cartItem.quantity !== adjustedQty) {
            updateQuantity(cartItem.id, cartItem.quantity); 
          }

          updateItemStock(cartItem.id, cartItem.stock);
        }

        return { error: null };
      } finally {
        setLoadingCount((c) => c - 1);
      }
    },
    [isAuthenticated, addItem, rollback, updateItemId, updateItemStock]
  );

  const updateQuantityMutation = useCallback(
    async (cartItemId: string, quantity: number) => {
      setLoadingCount((c) => c + 1);
      try {
        updateQuantity(cartItemId, quantity);

        if (!isAuthenticated) return { error: null };

        const { data, error } = await authenticatedAction(updateCartItemQuantity, {
          cartItemId,
          quantity,
        });

        if (error) {
          rollback();
          return { error };
        }

        if (data) {
          const { cartItem } = data;
          if (cartItem.quantity !== quantity) {
            updateQuantity(cartItem.id, cartItem.quantity);
          }

          updateItemStock(cartItem.id, cartItem.stock);
        }
      } finally {
        setLoadingCount((c) => c - 1);
      }
    },
    [isAuthenticated, updateQuantity, rollback, updateItemStock]
  );

  const removeItemMutation = useCallback(
    async (cartItemId: string) => {
      setLoadingCount((c) => c + 1);
      try {
        removeItem(cartItemId);

        if (!isAuthenticated) return { error: null };

        const { error } = await authenticatedAction(removeItemFromCart, { cartItemId });
        if (error) rollback();
      } finally {
        setLoadingCount((c) => c - 1);
      }
    },
    [isAuthenticated, removeItem, rollback]
  );

  return {
    addItemToCart: addItemMutation,
    updateCartItemQuantity: updateQuantityMutation,
    removeItemFromCart: removeItemMutation,
    isLoading,
  };
}
