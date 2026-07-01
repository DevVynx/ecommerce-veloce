import { db } from "@/shared/lib/db";

type FindReviewsByProductIdProps = {
  productId: string;
  offset?: number;
  limit?: number;
  rating?: number;
  sort?: "newest" | "relevant";
};

export const findReviewsByProductId = async ({
  productId,
  offset = 0,
  limit = 10,
  rating,
  sort = "newest",
}: FindReviewsByProductIdProps) => {
  const where = { productId, ...(rating ? { rating } : {}) };
  const orderBy =
    sort === "relevant" ? { rating: "desc" as const } : { createdAt: "desc" as const };

  const [reviews, total] = await Promise.all([
    db.review.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
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
    }),
    db.review.count({ where }),
  ]);

  return { reviews, total };
};
