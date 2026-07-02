import { orderServices } from "@/modules/order/services";
import { productServices } from "@/modules/product/services";
import { ConflictError, ForbiddenError } from "@/shared/utils/HttpErrors";

import { reviewRepositories } from "../repositories";

type CreateReviewParams = {
  userId: string;
  productId: string;
  rating: number;
  comment: string;
};

export const createReview = async ({ userId, productId, rating, comment }: CreateReviewParams) => {
  const existing = await reviewRepositories.findByUserAndProduct({ userId, productId });
  if (existing) {
    throw new ConflictError("Você já avaliou este produto.");
  }

  const result = await orderServices.validateOrderProduct({ userId, productId });
  if (!result) {
    throw new ForbiddenError("Você só pode avaliar produtos que já comprou.");
  }

  if (result.status !== "DELIVERED") {
    throw new ForbiddenError("Você só pode avaliar produtos após o recebimento.");
  }

  const review = await reviewRepositories.createReview({
    userId,
    productId,
    variantId: result.variantId,
    rating,
    comment,
  });

  await productServices.updateRatingAggregates({ productId });

  return { review };
};
