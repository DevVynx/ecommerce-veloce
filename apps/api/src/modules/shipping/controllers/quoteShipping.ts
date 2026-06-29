import { QuoteShippingResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import { shippingServices } from "@/modules/shipping/services";
import v from "@/modules/shipping/validators";

export const quoteShipping: RequestHandler = async (req, res: Response<QuoteShippingResponse>) => {
  const { userId } = res.locals.user;
  const { destinyCep } = v.quoteShipping.getValidatedValues(req).body;

  const { items, shippingOptions, freeShippingMinValue } = await shippingServices.getShippingQuote({
    userId,
    destinyCep,
  });

  return res.json({
    items,
    shippingOptions,
    freeShippingMinValue,
  });
};
