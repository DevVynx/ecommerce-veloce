import { Router } from "express";

import { createReview, deleteReview, getReviews, updateReview } from "@/modules/review/controllers";
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
reviewRouter.patch(
  "/products/:productId/reviews",
  authMiddleware,
  v.updateReview.middleware,
  updateReview
);
reviewRouter.delete(
  "/products/:productId/reviews",
  authMiddleware,
  v.deleteReview.middleware,
  deleteReview
);

export { reviewRouter };
