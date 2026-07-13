import type { CancelOrderParams } from "@/modules/order/types/ServiceParams";
import { db } from "@/shared/lib/db";

export const cancelOrder = async ({ orderId }: CancelOrderParams) => {
  const order = await db.$transaction(async (tx) => {
    await tx.couponUsage.deleteMany({ where: { orderId } });

    return await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELED" },
    });
  });

  return { order };
};
