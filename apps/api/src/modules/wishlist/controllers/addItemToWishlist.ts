import { AddItemToWishlistResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/wishlist/validators";
import { wishlistServices } from "@/modules/wishlist/services";

export const addItemToWishlist: RequestHandler = async (
  req,
  res: Response<AddItemToWishlistResponse>
) => {
  const { userId } = res.locals.user;
  const { productId } = v.addItemToWishlist.getValidatedValues(req).body;

  const { wishlistItem } = await wishlistServices.createWishlistItem({
    userId,
    productId,
  });

  return res.status(201).json({ wishlistItem });
};
