import { Router } from "express";

import { createReview, getReviews } from "@/modules/review/controllers";
import v from "@/modules/review/validators";
import { authMiddleware } from "@/shared/middlewares/auth";

const reviewRouter: Router = Router();

reviewRouter.get("/products/:productId/reviews", v.getReviews.middleware, getReviews);
reviewRouter.post(
  "/products/:productId/reviews",
  authMiddleware,
  v.createReview.middleware,
  createReview
);

export { reviewRouter };
