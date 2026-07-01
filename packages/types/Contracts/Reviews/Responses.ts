export type ReviewDto = {
  id: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
  variantLabel: string;
};

export type GetReviewsResponse = {
  reviews: ReviewDto[];
  pagination: { total: number; hasMore: boolean };
};

export type CreateReviewResponse = {
  review: ReviewDto;
};
