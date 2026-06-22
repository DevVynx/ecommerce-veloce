import type { ApplyCouponResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { couponServices } from "@/modules/coupons/services";
import v from "@/modules/coupons/validators";

export const validateCoupon: RequestHandler = async (req, res: Response<ApplyCouponResponse>) => {
  const { userId } = res.locals.user;
  const { code } = v.validateCoupon.getValidatedValues(req).body;

  const { coupon, discountValue } = await couponServices.validateCoupon({ userId, code });

  return res.json({ coupon, discountValue: Number(discountValue) });
};
