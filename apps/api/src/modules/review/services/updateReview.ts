import { productServices } from "@/modules/product/services";
import type { UpdateReviewParams } from "@/modules/review/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

import { reviewRepositories } from "../repositories";

export const updateReview = async ({ userId, productId, rating, comment }: UpdateReviewParams) => {
  const existing = await reviewRepositories.findByUserAndProduct({ userId, productId });

  if (!existing) {
    throw new NotFoundError("Avaliação não encontrada.");
  }

  const review = await reviewRepositories.updateReview({
    id: existing.id,
    rating,
    comment,
  });

  await productServices.updateRatingAggregates({ productId });

  return { review };
};
