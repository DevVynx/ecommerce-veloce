import { Router } from "express";

import { createPromotion, deletePromotion, searchPromotions, updatePromotion } from "@/modules/promotion/controllers";
import v from "@/modules/promotion/validators";
import { adminOnlyMiddleware } from "@/shared/middlewares/adminOnly";
import { authMiddleware } from "@/shared/middlewares/auth";

const promotionRouter: Router = Router();

promotionRouter.post(
  "/admin/promotions",
  authMiddleware,
  adminOnlyMiddleware,
  v.createPromotion.middleware,
  createPromotion
);

promotionRouter.get(
  "/admin/promotions/search",
  authMiddleware,
  adminOnlyMiddleware,
  v.searchPromotions.middleware,
  searchPromotions
);

promotionRouter.patch(
  "/admin/promotions/:id",
  authMiddleware,
  adminOnlyMiddleware,
  v.updatePromotion.middleware,
  updatePromotion
);

promotionRouter.delete(
  "/admin/promotions/:id",
  authMiddleware,
  adminOnlyMiddleware,
  v.deletePromotion.middleware,
  deletePromotion
);

export { promotionRouter };
