import { orderRepositories } from "@/modules/order/repositories";
import type { CancelOrderParams } from "@/modules/order/types/ServiceParams";

export const cancelOrder = async ({ orderId }: CancelOrderParams) => {
  const order = await orderRepositories.updateOrderStatus({
    orderId,
    status: "CANCELED",
  });

  return { order };
};
