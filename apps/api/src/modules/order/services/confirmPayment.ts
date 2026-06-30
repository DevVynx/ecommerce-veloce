import { cartServices } from "@/modules/cart/services";
import { orderRepositories } from "@/modules/order/repositories";
import type { ConfirmPaymentParams } from "@/modules/order/types/ServiceParams";

export const confirmPayment = async ({ orderId }: ConfirmPaymentParams) => {
  const order = await orderRepositories.updateOrderStatus({
    orderId,
    status: "PAID",
  });

  await cartServices.clearCart({ userId: order.userId });

  return { order };
};
