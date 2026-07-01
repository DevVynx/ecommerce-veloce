import { reviewRepositories } from "@/modules/review/repositories";
import type { GetReviewsParams } from "@/modules/review/types/ServiceParams";

export const getReviews = async ({
  productId,
  offset = 0,
  limit = 10,
  rating,
  sort = "newest",
}: GetReviewsParams) => {
  const { reviews, total } = await reviewRepositories.findReviewsByProductId({
    productId,
    offset,
    limit,
    rating,
    sort,
  });

  return { reviews, pagination: { total, hasMore: offset + limit < total } };
};
