import { stripe } from "@/infra/payment/stripe";
import { cartServices } from "@/modules/cart/services";
import { couponServices } from "@/modules/coupon/services";
import { orderRepositories } from "@/modules/order/repositories";
import type { CreateOrderParams } from "@/modules/order/types/ServiceParams";
import { shippingServices } from "@/modules/shipping/services";
import { userServices } from "@/modules/user/services";
import { db } from "@/shared/lib/db";
import { ENV } from "@/shared/utils/env";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/shared/utils/HttpErrors";

import { Prisma } from "../../../../prisma/generated/client/client";

export const createOrder = async ({
  userId,
  addressId,
  shippingAddress,
  paymentMethod,
  shippingService,
  couponCode,
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
  const productDiscount = new Prisma.Decimal(cart.summary.discount);

  let couponDiscount = new Prisma.Decimal(0);
  let couponId: string | undefined;

  if (couponCode) {
    const validated = await couponServices.validateCoupon({ userId, code: couponCode });

    couponId = validated.coupon.id;

    if (validated.coupon.type === "FREE_SHIPPING") {
      couponDiscount = shipping;
    } else {
      couponDiscount = validated.discountValue;
    }
  }

  const totalDiscount = productDiscount.plus(couponDiscount);
  const total = Prisma.Decimal.sub(Prisma.Decimal.add(subtotal, shipping), totalDiscount);
  const totalCents = Math.round(Number(total) * 100);

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
      discount: totalDiscount,
      paymentMethod,
      shippingAddress: addressJson,
    },
    items,
    couponId
      ? {
          userId,
          couponId,
          discountValue: couponDiscount,
        }
      : undefined
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
              name: "Pedido Teste",
              description: `Ambiente de demonstração. O valor de R$ ${total} é simbólico e serve apenas para validar o fluxo de pagamento com Stripe. Para testar o pagamento, utilize o cartão simulado do Stripe: 4242 4242 4242 4242 com qualquer validade futura.`,
            },
            currency: "BRL",
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        order_id: order.id,
      },
    });

    return { order, paymentUrl: paymentSession.url! };
  } catch (error) {
    await db.$transaction(async (tx) => {
      await tx.couponUsage.deleteMany({ where: { orderId: order.id } });
      await tx.order.update({
        where: { id: order.id },
        data: { status: "CANCELED" },
      });
    });

    throw error;
  }
};
