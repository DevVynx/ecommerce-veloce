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

  const order = await reviewRepositories.findPurchasedProduct({ userId, productId });
  if (!order) {
    throw new ForbiddenError("Você só pode avaliar produtos que já comprou.");
  }

  const orderItem = order.orderItems[0];
  if (!orderItem) {
    throw new ForbiddenError("Você só pode avaliar produtos que já comprou.");
  }

  const variantId = orderItem.productVariantId;

  const review = await reviewRepositories.createReview({
    userId,
    productId,
    variantId,
    rating,
    comment,
  });

  await productServices.updateRatingAggregates({ productId });

  return { review };
};
