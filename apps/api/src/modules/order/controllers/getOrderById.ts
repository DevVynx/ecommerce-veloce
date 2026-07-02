import type { GetOrderByIdResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { orderServices } from "@/modules/order/services";
import v from "@/modules/order/validators";

export const getOrderById: RequestHandler = async (req, res: Response<GetOrderByIdResponse>) => {
  const { userId } = res.locals.user;
  const { params } = v.getOrderById.getValidatedValues(req);
  const { orderId } = params;

  const { order } = await orderServices.findOrderById({ orderId, userId });

  res.json({ order });
};
