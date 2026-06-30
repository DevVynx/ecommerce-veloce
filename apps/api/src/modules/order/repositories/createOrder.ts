import { db } from "@/shared/lib/db";

import type { PaymentMethod, Prisma } from "../../../../prisma/generated/client/client";

type CreateOrderData = {
  userId: string;
  total: Prisma.Decimal;
  subtotal: Prisma.Decimal;
  shipping: Prisma.Decimal;
  discount: Prisma.Decimal;
  paymentMethod: PaymentMethod;
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
