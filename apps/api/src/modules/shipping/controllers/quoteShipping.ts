import { QuoteShippingResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/shipping/validators";
import { shippingServices } from "@/modules/shipping/services";

export const quoteShipping: RequestHandler = async (req, res: Response<QuoteShippingResponse>) => {
  const { userId } = res.locals.user;
  const { cartId, destinyCep } = v.quoteShipping.getValidatedValues(req).body;

  const { items, shippingOptions } = await shippingServices.getShippingQuote({
    userId,
    cartId,
    destinyCep,
  });

  return res.json({
    items,
    shippingOptions,
  });
};
