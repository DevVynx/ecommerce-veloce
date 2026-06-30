import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth";

import {
  createAddress,
  deleteAddress,
  listAddresses,
  profile,
  setDefault,
  updateAddress,
} from "./controllers";
import v from "./validators";

const userRouter: Router = Router();

userRouter.get("/users/profile", authMiddleware, profile);
userRouter.get("/users/addresses", authMiddleware, listAddresses);
userRouter.post("/users/addresses", authMiddleware, v.createAddress.middleware, createAddress);
userRouter.put(
  "/users/addresses/:addressId",
  authMiddleware,
  v.updateAddress.middleware,
  updateAddress
);
userRouter.delete(
  "/users/addresses/:addressId",
  authMiddleware,
  v.deleteAddress.middleware,
  deleteAddress
);
userRouter.put(
  "/users/addresses/:addressId/default",
  authMiddleware,
  v.setDefault.middleware,
  setDefault
);

export { userRouter };
