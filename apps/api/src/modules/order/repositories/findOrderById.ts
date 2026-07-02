import { db } from "@/shared/lib/db";

type FindOrderByIdProps = {
  id: string;
  userId: string;
};

export const findOrderById = async ({ id, userId }: FindOrderByIdProps) => {
  const order = await db.order.findFirst({
    where: { id, userId },
    include: {
      orderItems: {
        include: {
          productVariant: {
            include: {
              product: true,
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
      },
    },
  });

  return order;
};
