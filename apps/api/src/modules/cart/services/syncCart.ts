import type { SyncCartResponse } from "@repo/types/contracts";

import { cartServices } from "@/modules/cart/services";
import type { SyncCartParams } from "@/modules/cart/types/ServiceParams";
import { productServices } from "@/modules/product/services";
import { HttpError } from "@/shared/utils/HttpErrors";

export const syncCart = async ({ userId, items }: SyncCartParams) => {
  const results: SyncCartResponse["results"] = { succeeded: [], failed: [] };

  for (const item of items) {
    const { variant } = await productServices.findVariantByIdWithProduct({
      variantId: item.productVariantId,
    });
    const productTitle = variant?.product?.title ?? "Produto não encontrado";
    try {
      const { cartItem } = await cartServices.addCartItem({
        userId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
      });

      results.succeeded.push({
        productVariantId: item.productVariantId,
        productTitle,
        cartItemId: cartItem.id,
      });
    } catch (error) {
      if (error instanceof HttpError) {
        results.failed.push({
          productVariantId: item.productVariantId,
          productTitle,
          reason: error.message,
        });
      } else {
        results.failed.push({
          productVariantId: item.productVariantId,
          productTitle,
          reason: "Erro desconhecido ao adicionar o item ao carrinho.",
        });
      }
    }
  }

  const { cart } = await cartServices.findCartByUserId({ userId });

  return { cart, results };
};
