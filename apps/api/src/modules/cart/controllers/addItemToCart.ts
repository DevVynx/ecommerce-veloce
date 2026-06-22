import { AddItemToCartResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/cart/validators";
import { cartServices } from "@/modules/cart/services";

export const addItemToCart: RequestHandler = async (req, res: Response<AddItemToCartResponse>) => {
  const { userId } = res.locals.user;
  const { productVariantId, quantity } = v.addItemToCart.getValidatedValues(req).body;

  const { cartItem } = await cartServices.addCartItem({
    userId,
    productVariantId,
    quantity,
  });

  return res.status(201).json({ cartItem });
};
