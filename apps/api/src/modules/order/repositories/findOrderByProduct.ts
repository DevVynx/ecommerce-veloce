import { db } from "@/shared/lib/db";

type FindOrderByProductProps = {
  userId: string;
  productId: string;
};

export const findOrderByProduct = async ({ userId, productId }: FindOrderByProductProps) => {
  return db.order.findFirst({
    where: {
      userId,
      orderItems: { some: { productVariant: { productId } } },
    },
    include: {
      orderItems: {
        where: { productVariant: { productId } },
        take: 1,
      },
    },
  });
};
