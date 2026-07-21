import type { DeletePromotionResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { promotionServices } from "@/modules/promotion/services";
import v from "@/modules/promotion/validators";

export const deletePromotion: RequestHandler = async (
  req,
  res: Response<DeletePromotionResponse>
) => {
  const { id } = v.deletePromotion.getValidatedValues(req).params;

  await promotionServices.deletePromotion(id);

  res.status(204).send();
};
