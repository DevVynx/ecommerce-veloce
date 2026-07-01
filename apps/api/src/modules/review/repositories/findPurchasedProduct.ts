import { db } from "@/shared/lib/db";

type FindPurchasedProductProps = {
  userId: string;
  productId: string;
};

export const findPurchasedProduct = async ({ userId, productId }: FindPurchasedProductProps) => {
  return db.order.findFirst({
    where: {
      userId,
      status: "PAID",
      orderItems: {
        some: {
          productVariant: { productId },
        },
      },
    },
    include: {
      orderItems: {
        where: { productVariant: { productId } },
        include: {
          productVariant: {
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
        take: 1,
      },
    },
  });
};
