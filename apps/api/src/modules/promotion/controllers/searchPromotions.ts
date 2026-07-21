import type { AdminSearchPromotionsResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { promotionServices } from "@/modules/promotion/services";
import v from "@/modules/promotion/validators";

export const searchPromotions: RequestHandler = async (
  req,
  res: Response<AdminSearchPromotionsResponse>
) => {
  const { query } = v.searchPromotions.getValidatedValues(req);

  const result = await promotionServices.searchPromotions(query);

  res.json(result);
};
