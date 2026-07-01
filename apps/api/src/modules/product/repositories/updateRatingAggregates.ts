import { db } from "@/shared/lib/db";

import { Prisma } from "../../../../prisma/generated/client/client";

type UpdateRatingAggregatesProps = {
  productId: string;
};

export const updateRatingAggregates = async ({ productId }: UpdateRatingAggregatesProps) => {
  const result = await db.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  return db.product.update({
    where: { id: productId },
    data: {
      ratingRate: new Prisma.Decimal((result._avg.rating ?? 0).toFixed(1)),
      ratingCount: result._count.rating,
    },
  });
};
