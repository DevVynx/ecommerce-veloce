import { db } from "@/shared/lib/db";

import type { Prisma } from "../../../../prisma/generated/client/client";

type CreateOrderData = {
  userId: string;
  total: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  shipping: Prisma.Decimal;
  discount: Prisma.Decimal;
  contribution: Prisma.Decimal;
  paymentMethod: string;
  shippingAddress: Prisma.JsonObject;
};

type CreateOrderItemData = {
  productVariantId: string;
  quantity: number;
  unitPrice: Prisma.Decimal;
};

export const createOrder = async (orderData: CreateOrderData, itemsData: CreateOrderItemData[]) => {
  const order = await db.order.create({
    data: {
      userId: orderData.userId,
      total: orderData.total,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      discount: orderData.discount,
      contribution: orderData.contribution,
      paymentMethod: orderData.paymentMethod,
      shippingAddress: orderData.shippingAddress,
      orderItems: {
        create: itemsData.map((item) => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      },
    },
    include: {
      orderItems: true,
    },
  });

  return order;
};
