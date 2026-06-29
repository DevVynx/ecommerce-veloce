import { cartServices } from "@/modules/cart/services";
import { orderRepositories } from "@/modules/orders/repositories";
import type { ConfirmPaymentParams } from "@/modules/orders/types/ServiceParams";

export const confirmPayment = async ({ orderId }: ConfirmPaymentParams) => {
  const order = await orderRepositories.updateOrderStatus({
    orderId,
    status: "PAID",
  });

  await cartServices.clearCart({ userId: order.userId });

  return { order };
};
