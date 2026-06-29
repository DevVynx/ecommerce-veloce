import { orderRepositories } from "@/modules/orders/repositories";
import type { CancelOrderParams } from "@/modules/orders/types/ServiceParams";

export const cancelOrder = async ({ orderId }: CancelOrderParams) => {
  const order = await orderRepositories.updateOrderStatus({
    orderId,
    status: "CANCELED",
  });

  return { order };
};
