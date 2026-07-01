import { db } from "@/shared/lib/db";

type FindByUserAndProductProps = {
  userId: string;
  productId: string;
};

export const findByUserAndProduct = async ({ userId, productId }: FindByUserAndProductProps) => {
  return db.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
};
