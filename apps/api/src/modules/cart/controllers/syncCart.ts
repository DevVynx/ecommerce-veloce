import { SyncCartResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/cart/helpers/validators";
import { cartMappers } from "@/modules/cart/mappers";
import { cartServices } from "@/modules/cart/services";

export const syncCart: RequestHandler = async (req, res: Response<SyncCartResponse>) => {
  const { userId } = res.locals.user;
  const { items } = v.syncCart.getValidatedValues(req).body;

  const { cart, results } = await cartServices.syncCart({ userId, items });

  const { cart: formattedCart } = cartMappers.toUserCart(cart);

  return res.json({ cart: formattedCart, results });
};
