import { productServices } from "@/modules/product/services";
import type { DeleteReviewParams } from "@/modules/review/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

import { reviewRepositories } from "../repositories";

export const deleteReview = async ({ userId, productId }: DeleteReviewParams) => {
  const existing = await reviewRepositories.findByUserAndProduct({ userId, productId });

  if (!existing) {
    throw new NotFoundError("Avaliação não encontrada.");
  }

  await reviewRepositories.deleteReview({ id: existing.id });

  await productServices.updateRatingAggregates({ productId });
};
