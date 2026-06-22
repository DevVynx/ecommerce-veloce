import { RemoveItemFromCartResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/cart/validators";
import { cartServices } from "@/modules/cart/services";

export const removeItemFromCart: RequestHandler = async (
  req,
  res: Response<RemoveItemFromCartResponse>
) => {
  const { userId } = res.locals.user;
  const { cartItemId } = v.removeItemFromCart.getValidatedValues(req).params;

  await cartServices.deleteCartItem({ cartItemId, userId });

  return res.status(204).send();
};
