import type { CreatePromotionResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { promotionServices } from "@/modules/promotion/services";
import v from "@/modules/promotion/validators";

export const createPromotion: RequestHandler = async (
  req,
  res: Response<CreatePromotionResponse>
) => {
  const data = v.createPromotion.getValidatedValues(req).body;

  const result = await promotionServices.createPromotion(data);

  return res.status(201).json(result);
};
