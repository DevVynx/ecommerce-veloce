import type { CreateReviewResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { reviewMappers } from "@/modules/review/mappers";
import { reviewServices } from "@/modules/review/services";
import v from "@/modules/review/validators";

export const createReview: RequestHandler = async (req, res: Response<CreateReviewResponse>) => {
  const { userId } = res.locals.user;

  const { body, params } = v.createReview.getValidatedValues(req);
  const { comment, rating } = body;
  const { productId } = params;

  const { review } = await reviewServices.createReview({ userId, productId, rating, comment });

  res.status(201).json({ review: reviewMappers.toReviewDto(review) });
};
