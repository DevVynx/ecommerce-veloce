import { RemoveWishlistItemResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/wishlist/validators";
import { wishlistServices } from "@/modules/wishlist/services";

export const removeItemFromWishlist: RequestHandler = async (
  req,
  res: Response<RemoveWishlistItemResponse>
) => {
  const { userId } = res.locals.user;
  const { productId } = v.removeItemFromWishlist.getValidatedValues(req).params;

  await wishlistServices.deleteWishlistItem({ productId, userId });

  return res.status(204).send();
};
