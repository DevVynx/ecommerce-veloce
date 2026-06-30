import { productServices } from "@/modules/product/services";
import { wishlistRepositories } from "@/modules/wishlist/repositories";
import type { CreateWishlistItemParams } from "@/modules/wishlist/types/ServiceParams";
import { ConflictError, NotFoundError } from "@/shared/utils/HttpErrors";

export const createWishlistItem = async ({ userId, productId }: CreateWishlistItemParams) => {
  const product = await productServices.findById({ productId });

  if (!product) {
    throw new NotFoundError("Produto não encontrado.");
  }

  let wishlist = await wishlistRepositories.existsByUserId({ userId });

  if (!wishlist) {
    wishlist = await wishlistRepositories.create({ userId });
  }

  const existingItem = await wishlistRepositories.findItemByProductId({
    wishlistId: wishlist.id,
    productId,
  });

  if (existingItem) {
    throw new ConflictError("Este produto já está na sua lista de desejos");
  }

  const wishlistItem = await wishlistRepositories.addItem({ wishlistId: wishlist.id, productId });

  return { wishlistItem };
};
