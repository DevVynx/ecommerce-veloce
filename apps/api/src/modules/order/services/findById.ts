import type { ShippingAddressDto } from "@repo/types/contracts";

import type { FindOrderByIdParams } from "@/modules/order/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";

import { formatVariantLabel } from "../../review/helpers/formatVariantLabel";
import { reviewRepositories } from "../../review/repositories";
import { orderRepositories } from "../repositories";

export const findOrderById = async ({ orderId, userId }: FindOrderByIdParams) => {
  const order = await orderRepositories.findOrderById({ id: orderId, userId });

  if (!order) {
    throw new NotFoundError("Pedido não encontrado.");
  }

  const shippingAddress =
    typeof order.shippingAddress === "object" && order.shippingAddress !== null
      ? (order.shippingAddress as ShippingAddressDto)
      : null;

  const items = await Promise.all(
    order.orderItems.map(async (item) => {
      const product = item.productVariant.product;
      const variantLabel = formatVariantLabel(item.productVariant.productVariantOptions);
      const totalPrice = Number(item.unitPrice) * item.quantity;
      const productId = product.id;

      const userReview = await reviewRepositories.findByUserAndProduct({ userId, productId });

      return {
        id: item.id,
        productId,
        productName: product.title,
        productSlug: product.slug,
        productImage: product.image,
        variantLabel,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice,
        hasReviewed: !!userReview,
        userReview: userReview
          ? {
              id: userReview.id,
              rating: userReview.rating,
              comment: userReview.comment,
              createdAt: userReview.createdAt.toISOString(),
            }
          : null,
      };
    })
  );

  return {
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      total: Number(order.total),
      subtotal: Number(order.subtotal),
      shipping: Number(order.shipping),
      discount: Number(order.discount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
      items,
      shippingAddress: shippingAddress
        ? {
            receiverName: shippingAddress.receiverName,
            street: shippingAddress.street,
            number: shippingAddress.number,
            complement: shippingAddress.complement,
            neighborhood: shippingAddress.neighborhood,
            city: shippingAddress.city,
            state: shippingAddress.state,
            cep: shippingAddress.cep,
          }
        : null,
    },
  };
};
