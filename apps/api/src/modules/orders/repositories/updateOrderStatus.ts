import { db } from "@/shared/lib/db";

import type { OrderStatus } from "../../../../prisma/generated/client/enums";

type UpdateOrderStatusData = {
  orderId: string;
  status: OrderStatus;
};

export const updateOrderStatus = async ({ orderId, status }: UpdateOrderStatusData) => {
  const updated = await db.order.update({
    where: { id: orderId },
    data: { status },
  });

  return updated;
};
