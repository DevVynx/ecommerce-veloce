export type GetReviewsRequest = {
  productId: string;
  offset?: number;
  limit?: number;
  rating?: number;
  sort?: "newest" | "relevant";
};

export type CreateReviewRequest = {
  rating: number;
  comment: string;
};
