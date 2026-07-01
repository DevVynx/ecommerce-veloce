import { db } from "@/shared/lib/db";

type CreateReviewProps = {
  userId: string;
  productId: string;
  variantId: string;
  rating: number;
  comment: string;
};

export const createReview = async ({
  userId,
  productId,
  variantId,
  rating,
  comment,
}: CreateReviewProps) => {
  return db.review.create({
    data: { userId, productId, variantId, rating, comment },
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
