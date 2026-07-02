import type { UpdateReviewResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { reviewMappers } from "@/modules/review/mappers";
import { reviewServices } from "@/modules/review/services";
import v from "@/modules/review/validators";

export const updateReview: RequestHandler = async (req, res: Response<UpdateReviewResponse>) => {
  const { userId } = res.locals.user;

  const { body, params } = v.updateReview.getValidatedValues(req);
  const { rating, comment } = body;
  const { productId } = params;

  const { review } = await reviewServices.updateReview({ userId, productId, rating, comment });

  res.json({ review: reviewMappers.toReviewDto(review) });
};
