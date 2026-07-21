import type { UpdatePromotionResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { promotionServices } from "@/modules/promotion/services";
import v from "@/modules/promotion/validators";

export const updatePromotion: RequestHandler = async (
  req,
  res: Response<UpdatePromotionResponse>
) => {
  const { id } = v.updatePromotion.getValidatedValues(req).params;
  const data = v.updatePromotion.getValidatedValues(req).body;

  const result = await promotionServices.updatePromotion(id, data);

  return res.json(result);
};
