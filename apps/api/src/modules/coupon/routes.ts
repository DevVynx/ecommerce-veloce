import { Router } from "express";

import {
  createCoupon,
  deleteCoupon,
  searchCoupons,
  updateCoupon,
  validateCoupon,
} from "@/modules/coupon/controllers";
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

couponRouter.get(
  "/admin/coupons/search",
  authMiddleware,
  adminOnlyMiddleware,
  v.searchCoupons.middleware,
  searchCoupons
);

couponRouter.patch(
  "/admin/coupons/:id",
  authMiddleware,
  adminOnlyMiddleware,
  v.updateCoupon.middleware,
  updateCoupon
);

couponRouter.delete(
  "/admin/coupons/:id",
  authMiddleware,
  adminOnlyMiddleware,
  v.deleteCoupon.middleware,
  deleteCoupon
);

couponRouter.post("/coupons/validate", authMiddleware, v.validateCoupon.middleware, validateCoupon);

export { couponRouter };
