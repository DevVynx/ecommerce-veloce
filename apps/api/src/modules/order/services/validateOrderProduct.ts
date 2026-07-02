import { orderRepositories } from "../repositories";

type ValidateOrderProductParams = {
  userId: string;
  productId: string;
};

export const validateOrderProduct = async ({ userId, productId }: ValidateOrderProductParams) => {
  const order = await orderRepositories.findOrderByProduct({ userId, productId });

  if (!order) return null;

  const orderItem = order.orderItems[0];
  if (!orderItem) return null;

  return { variantId: orderItem.productVariantId, status: order.status };
};
