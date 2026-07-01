import { createReview } from "./createReview";
import { findByUserAndProduct } from "./findByUserAndProduct";
import { findPurchasedProduct } from "./findPurchasedProduct";
import { findReviewsByProductId } from "./findReviewsByProductId";

export const reviewRepositories = {
  createReview,
  findByUserAndProduct,
  findPurchasedProduct,
  findReviewsByProductId,
};
