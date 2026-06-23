import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth";

import {
  createAddress,
  deleteAddress,
  listAddresses,
  setDefault,
  updateAddress,
} from "./controllers";
import v from "./validators";

const addressRouter: Router = Router();

addressRouter.get("/users/addresses", authMiddleware, listAddresses);
addressRouter.post("/users/addresses", authMiddleware, v.createAddress.middleware, createAddress);
addressRouter.put(
  "/users/addresses/:addressId",
  authMiddleware,
  v.updateAddress.middleware,
  updateAddress
);
addressRouter.delete(
  "/users/addresses/:addressId",
  authMiddleware,
  v.deleteAddress.middleware,
  deleteAddress
);
addressRouter.put(
  "/users/addresses/:addressId/default",
  authMiddleware,
  v.setDefault.middleware,
  setDefault
);

export { addressRouter };
