import type { GetReviewsResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { reviewMappers } from "@/modules/review/mappers";
import { reviewServices } from "@/modules/review/services";
import v from "@/modules/review/validators";

export const getReviews: RequestHandler = async (req, res: Response<GetReviewsResponse>) => {
  const { query, params } = v.getReviews.getValidatedValues(req);

  const { limit, offset, rating, sort } = query;
  const { productId } = params;

  const { reviews, pagination } = await reviewServices.getReviews({
    productId,
    offset,
    limit,
    rating,
    sort,
  });

  const formmatedReviews = reviews.map(reviewMappers.toReviewDto);

  res.json({ reviews: formmatedReviews, pagination });
};
