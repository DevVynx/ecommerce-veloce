import type { CreateOrderResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { orderServices } from "@/modules/orders/services";
import v from "@/modules/orders/validators";

export const createOrder: RequestHandler = async (req, res: Response<CreateOrderResponse>) => {
  const { userId } = res.locals.user;
  const { addressId, shippingAddress, shippingPrice, paymentMethod } =
    v.createOrder.getValidatedValues(req).body;

  const { order, paymentUrl } = await orderServices.createOrder({
    userId,
    addressId,
    shippingAddress,
    shippingPrice,
    paymentMethod,
  });

  res.status(201).json({ order, paymentUrl });
};
