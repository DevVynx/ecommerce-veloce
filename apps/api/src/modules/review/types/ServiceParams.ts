import type { GetReviewsRequest } from "@repo/types/contracts";

export type GetReviewsParams = GetReviewsRequest;

export type UpdateReviewParams = {
  userId: string;
  productId: string;
  rating?: number;
  comment?: string;
};

export type DeleteReviewParams = {
  userId: string;
  productId: string;
};
