import { cartServices } from "@/modules/cart/services";
import { couponRepositories } from "@/modules/coupon/repositories";
import type { ValidateCouponParams } from "@/modules/coupon/types/ServiceParams";
import { NotFoundError, UnprocessableEntityError } from "@/shared/utils/HttpErrors";

import { Prisma } from "../../../../prisma/generated/client/client";

export const validateCoupon = async ({ userId, code }: ValidateCouponParams) => {
  const coupon = await couponRepositories.findByCode({ code });

  if (!coupon) {
    throw new NotFoundError("Cupom não encontrado.");
  }

  if (!coupon.isActive) {
    throw new UnprocessableEntityError("Cupom inativo.");
  }

  const now = new Date();

  if (now < coupon.startsAt) {
    throw new UnprocessableEntityError("Cupom ainda não está disponível.");
  }

  if (now > coupon.endsAt) {
    throw new UnprocessableEntityError("Cupom expirado.");
  }

  const totalUsages = await couponRepositories.countGlobalUsages({
    couponId: coupon.id,
  });

  if (totalUsages >= coupon.usageLimit) {
    throw new UnprocessableEntityError("Cupom esgotado.");
  }

  const userUsages = await couponRepositories.countUsagesByUser({
    couponId: coupon.id,
    userId,
  });

  if (userUsages >= coupon.usageLimitPerUser) {
    throw new UnprocessableEntityError("Você já utilizou este cupom.");
  }

  const { cart } = await cartServices.findCartByUserId({ userId });

  if (!cart || cart.items.length === 0) {
    throw new UnprocessableEntityError("Carrinho vazio.");
  }

  const subtotal = cart.summary.subtotal;

  if (subtotal.lessThan(coupon.minOrderValue)) {
    throw new UnprocessableEntityError(`Valor mínimo do pedido é R$ ${coupon.minOrderValue}.`);
  }

  let discountValue: Prisma.Decimal = new Prisma.Decimal(0);

  if (coupon.type === "FREE_SHIPPING") {
    discountValue = new Prisma.Decimal(0);
  }

  if (coupon.type === "PERCENTAGE") {
    discountValue = subtotal.times(coupon.value).div(100);

    if (coupon.maxDiscount) {
      discountValue = Prisma.Decimal.min(discountValue, coupon.maxDiscount);
    }
  }

  if (coupon.type === "FIXED") {
    discountValue = Prisma.Decimal.min(new Prisma.Decimal(coupon.value), subtotal);
  }

  discountValue = discountValue.toDecimalPlaces(2);

  return {
    coupon: {
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
    },
    discountValue,
  };
};
