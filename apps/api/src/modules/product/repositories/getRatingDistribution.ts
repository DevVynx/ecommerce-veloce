import { db } from "@/shared/lib/db";

type GetRatingDistributionProps = {
  productId: string;
};

export const getRatingDistribution = async ({ productId }: GetRatingDistributionProps) => {
  const result = await db.review.groupBy({
    by: ["rating"],
    where: { productId },
    _count: { rating: true },
  });

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const row of result) {
    distribution[row.rating] = row._count.rating;
  }

  return distribution;
};
