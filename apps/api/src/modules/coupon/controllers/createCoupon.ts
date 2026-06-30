import type { CreateCouponResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { couponServices } from "@/modules/coupon/services";
import v from "@/modules/coupon/validators";

export const createCoupon: RequestHandler = async (req, res: Response<CreateCouponResponse>) => {
  const data = v.createCoupon.getValidatedValues(req).body;

  const { coupon } = await couponServices.createCoupon(data);

  return res.status(201).json({
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
      minOrderValue: Number(coupon.minOrderValue),
      startsAt: coupon.startsAt,
      endsAt: coupon.endsAt,
      usageLimit: coupon.usageLimit,
      usageLimitPerUser: coupon.usageLimitPerUser,
      isActive: coupon.isActive,
    },
  });
};
