import { Router } from "express";

import {
  countActiveOrders,
  createOrder,
  getAll,
  getOrderById,
  listOrders,
} from "@/modules/order/controllers";
import { adminOnlyMiddleware } from "@/shared/middlewares/adminOnly";
import { authMiddleware } from "@/shared/middlewares/auth";
import { checkoutLimiter } from "@/shared/middlewares/rateLimiters";

import v from "./validators";

const orderRouter: Router = Router();

orderRouter.get("/orders", authMiddleware, listOrders);
orderRouter.get("/orders/:orderId", authMiddleware, v.getOrderById.middleware, getOrderById);
orderRouter.post("/orders", checkoutLimiter, authMiddleware, v.createOrder.middleware, createOrder);

orderRouter.get("/admin/orders", authMiddleware, adminOnlyMiddleware, v.getAll.middleware, getAll);
orderRouter.get(
  "/admin/orders/active",
  authMiddleware,
  adminOnlyMiddleware,
  v.activeOrders.middleware,
  countActiveOrders
);

export { orderRouter };
