import type { OrderDto } from "@repo/types/contracts";

import { stripe } from "@/infra/payment/stripe";
import { cartServices } from "@/modules/cart/services";
import { orderRepositories } from "@/modules/orders/repositories";
import type { CreateOrderParams } from "@/modules/orders/types/ServiceParams";
import { shippingServices } from "@/modules/shipping/services";
import { userServices } from "@/modules/user/services";
import { ENV } from "@/shared/utils/env";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/shared/utils/HttpErrors";

import { Prisma } from "../../../../prisma/generated/client/client";

export const createOrder = async ({
  userId,
  addressId,
  shippingAddress,
  paymentMethod,
  shippingService,
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

  const destinyCep = addressData.cep;
  const { shippingOptions } = await shippingServices.getShippingQuote({
    userId,
    destinyCep,
  });

  const selectedShipping = shippingOptions.find((opt) => opt.service === shippingService);
  if (!selectedShipping) throw new BadRequestError("Serviço de frete inválido.");

  const subtotal = new Prisma.Decimal(cart.summary.subtotal);
  const shipping = new Prisma.Decimal(selectedShipping.price);
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

  try {
    const paymentSession = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${ENV.FRONTEND_URL}/checkout/success?order=${order.orderNumber}`,
      cancel_url: `${ENV.FRONTEND_URL}/checkout/error`,
      payment_method_types: [paymentMethod],
      line_items: [
        {
          price_data: {
            product_data: {
              name: "Contribuição BeliBeli",
              description:
                "Ambiente de demonstração. O valor de R$ 3,00 é simbólico e serve apenas para validar o fluxo de pagamento com Stripe. Para testar o pagamento, utilize o cartão simulado do Stripe: 4242 4242 4242 4242 com qualquer validade futura.",
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

    const orderDto: OrderDto = {
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
  } catch (error) {
    await orderRepositories.updateOrderStatus({ orderId: order.id, status: "CANCELED" });

    throw error;
  }
};
