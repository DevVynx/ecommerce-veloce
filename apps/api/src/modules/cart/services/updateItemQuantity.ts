import { cartRepositories } from "@/modules/cart/repositories";
import type { UpdateCartItemQuantityParams } from "@/modules/cart/types/ServiceParams";
import { productServices } from "@/modules/products/services";
import { ForbiddenError, NotFoundError, UnprocessableEntityError } from "@/shared/utils/HttpErrors";

export const updateCartItemQuantity = async ({
  userId,
  cartItemId,
  quantity,
}: UpdateCartItemQuantityParams) => {
  const item = await cartRepositories.findItemById({ cartItemId });

  if (!item) {
    throw new NotFoundError("Item do carrinho não encontrado.");
  }

  if (item.cart.userId !== userId) {
    throw new ForbiddenError("Item do carrinho não pertence ao usuário.");
  }

  const { variant } = await productServices.findVariantById({ variantId: item.productVariantId });

  if (!variant) {
    throw new NotFoundError("Variante do produto não encontrada.");
  }

  if (!variant.isActive) {
    await cartRepositories.deleteItem({ cartItemId });
    throw new UnprocessableEntityError("Variante do produto não está ativa.");
  }

  if (variant.stock === 0) {
    await cartRepositories.deleteItem({ cartItemId });
    throw new UnprocessableEntityError("Variante do produto está sem estoque.");
  }

  if (quantity > variant.stock) {
    const cartItem = await cartRepositories.updateItemQuantity({
      cartItemId,
      quantity: variant.stock,
    });

    return { cartItem };
  }

  const cartItem = await cartRepositories.updateItemQuantity({ cartItemId, quantity });

  return { cartItem };
};
