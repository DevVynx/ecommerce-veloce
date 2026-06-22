import { UpdateCartItemQuantityResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/cart/validators";
import { cartServices } from "@/modules/cart/services";

export const updateCartItemQuantity: RequestHandler = async (
  req,
  res: Response<UpdateCartItemQuantityResponse>
) => {
  const { userId } = res.locals.user;
  const { quantity } = v.updateCartItemQuantity.getValidatedValues(req).body;
  const { cartItemId } = v.updateCartItemQuantity.getValidatedValues(req).params;

  const { cartItem } = await cartServices.updateCartItemQuantity({
    cartItemId,
    quantity,
    userId,
  });

  return res.json({ cartItem });
};
