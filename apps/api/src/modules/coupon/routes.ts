import { Router } from "express";

import { createCoupon, validateCoupon } from "@/modules/coupon/controllers";
import v from "@/modules/coupon/validators";
import { adminOnlyMiddleware } from "@/shared/middlewares/adminOnly";
import { authMiddleware } from "@/shared/middlewares/auth";

const couponRouter: Router = Router();

couponRouter.post(
  "/coupons",
  authMiddleware,
  adminOnlyMiddleware,
  v.createCoupon.middleware,
  createCoupon
);

couponRouter.post("/coupons/validate", authMiddleware, v.validateCoupon.middleware, validateCoupon);

export { couponRouter };
