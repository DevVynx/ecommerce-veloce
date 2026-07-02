import type { DeleteReviewResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { reviewServices } from "@/modules/review/services";
import v from "@/modules/review/validators";

export const deleteReview: RequestHandler = async (req, res: Response<DeleteReviewResponse>) => {
  const { userId } = res.locals.user;
  const { params } = v.deleteReview.getValidatedValues(req);
  const { productId } = params;

  await reviewServices.deleteReview({ userId, productId });

  res.status(204).send();
};
