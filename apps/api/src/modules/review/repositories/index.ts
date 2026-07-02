import { createReview } from "./createReview";
import { deleteReview } from "./deleteReview";
import { findByUserAndProduct } from "./findByUserAndProduct";
import { findReviewsByProductId } from "./findReviewsByProductId";
import { updateReview } from "./updateReview";

export const reviewRepositories = {
  createReview,
  deleteReview,
  findByUserAndProduct,
  findReviewsByProductId,
  updateReview,
};
