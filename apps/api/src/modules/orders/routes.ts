import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth";

import { createOrder } from "./controllers/createOrder";
import v from "./validators";

const orderRouter: Router = Router();

orderRouter.post("/orders", authMiddleware, v.createOrder.middleware, createOrder);

export { orderRouter };
