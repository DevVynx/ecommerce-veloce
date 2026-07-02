import { db } from "@/shared/lib/db";

type UpdateReviewProps = {
  id: string;
  rating?: number;
  comment?: string;
};

export const updateReview = async ({ id, rating, comment }: UpdateReviewProps) => {
  return db.review.update({
    where: { id },
    data: { ...(rating !== undefined && { rating }), ...(comment !== undefined && { comment }) },
    include: {
      user: { select: { name: true } },
      variant: {
        include: {
          productVariantOptions: {
            include: {
              productOptionValue: {
                include: { productOption: true },
              },
            },
          },
        },
      },
    },
  });
};
