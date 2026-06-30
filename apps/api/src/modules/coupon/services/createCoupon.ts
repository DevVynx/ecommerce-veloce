import { generateDescription } from "@/modules/coupon/helpers/generateDescription";
import { couponRepositories } from "@/modules/coupon/repositories";
import type { CreateCouponParams } from "@/modules/coupon/types/ServiceParams";
import { ConflictError } from "@/shared/utils/HttpErrors";

export const createCoupon = async (params: CreateCouponParams) => {
  const existing = await couponRepositories.findByCode({ code: params.code });

  if (existing) {
    throw new ConflictError("Já existe um cupom com este código.");
  }

  const description =
    params.description ?? generateDescription(params.type, params.value ?? 0, params.maxDiscount);

  const coupon = await couponRepositories.create({
    code: params.code,
    description,
    type: params.type,
    value: params.value ?? 0,
    maxDiscount: params.maxDiscount ?? null,
    minOrderValue: params.minOrderValue ?? 1,
    startsAt: params.startsAt,
    endsAt: params.endsAt,
    usageLimit: params.usageLimit,
    usageLimitPerUser: params.usageLimitPerUser ?? 1,
    isActive: params.isActive ?? true,
  });

  return { coupon };
};
