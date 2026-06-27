import { stripe } from "@/infra/payment/stripe";
import { cartServices } from "@/modules/cart/services";
import { orderRepositories } from "@/modules/orders/repositories";
import type { CreateOrderParams } from "@/modules/orders/types/ServiceParams";
import { userServices } from "@/modules/user/services";
import { ENV } from "@/shared/utils/env";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/shared/utils/HttpErrors";

import { Prisma } from "../../../../prisma/generated/client/client";

export const createOrder = async ({
  userId,
  addressId,
  shippingAddress,
  paymentMethod,
  shippingPrice,
}: CreateOrderParams) => {
  const { cart } = await cartServices.findCartByUserId({ userId });

  if (!cart) throw new NotFoundError("Carrinho não encontrado.");
  if (cart.items.length === 0) throw new ForbiddenError("Carrinho vazio.");

  let addressData;
  if (addressId) {
    const { address } = await userServices.findAddressById({ addressId });
    if (!address) throw new NotFoundError("Endereço não encontrado.");
    if (address.userId !== userId) throw new ForbiddenError("Endereço não pertence ao usuário.");
    addressData = address;
  } else if (shippingAddress) {
    addressData = shippingAddress;
  } else {
    throw new BadRequestError("Endereço é obrigatório.");
  }

  const items = cart.items.map((item) => {
    const variant = item.product.variant;
    const price = variant.offer.isOnSale ? Number(variant.offer.salePrice) : Number(variant.price);

    return {
      productVariantId: variant.id,
      quantity: item.quantity,
      unitPrice: new Prisma.Decimal(price),
    };
  });

  const subtotal = new Prisma.Decimal(cart.summary.subtotal);
  const shipping = new Prisma.Decimal(shippingPrice);
  const discount = new Prisma.Decimal(cart.summary.discount);
  const contribution = new Prisma.Decimal(5);
  const total = Prisma.Decimal.sub(Prisma.Decimal.add(subtotal, shipping), discount);

  const addressJson = {
    receiverName: addressData.receiverName,
    cep: addressData.cep,
    street: addressData.street,
    number: addressData.number,
    complement: addressData.complement,
    neighborhood: addressData.neighborhood,
    city: addressData.city,
    state: addressData.state,
  };

  const order = await orderRepositories.createOrder(
    {
      userId,
      total,
      subtotal,
      shipping,
      discount,
      contribution,
      paymentMethod,
      shippingAddress: addressJson,
    },
    items
  );

  const { user } = await userServices.getProfile({ userId });

  const paymentSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${ENV.FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ENV.FRONTEND_URL}`,
    payment_method_types: [paymentMethod],
    line_items: [
      {
        price_data: {
          product_data: {
            name: "Contribuição BeliBeli",
            description:
              "Ambiente de demonstração. O valor de R$ 3,00 é simbólico e serve apenas para validar o fluxo de pagamento com Stripe.",
          },
          currency: "BRL",
          unit_amount: 300,
        },
        quantity: 1,
      },
    ],
    customer_email: user.email,
    metadata: {
      order_id: order.id,
    },
  });

  await cartServices.clearCart({ userId });

  const orderDto = {
    id: order.id,
    total: Number(total),
    subtotal: Number(subtotal),
    shipping: Number(shipping),
    discount: Number(discount),
    contribution: Number(contribution),
    status: "PENDING",
    paymentMethod,
    createdAt: order.createdAt.toISOString(),
  };

  return { order: orderDto, paymentUrl: paymentSession.url! };
};
