import { db } from "@/shared/lib/db";

type DeleteReviewProps = {
  id: string;
};

export const deleteReview = async ({ id }: DeleteReviewProps) => {
  return db.review.delete({ where: { id } });
};
