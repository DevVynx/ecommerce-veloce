import { cartRepositories } from "@/modules/cart/repositories";
import type { ClearCartParams } from "@/modules/cart/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

export const clearCart = async ({ userId }: ClearCartParams) => {
  const cart = await cartRepositories.findByUserId({ userId });

  if (!cart) throw new NotFoundError("Carrinho não encontrado.");

  await cartRepositories.clearCart({ cartId: cart.id });
};
