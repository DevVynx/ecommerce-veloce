import { Router } from "express";

import { adminOnlyMiddleware } from "@/shared/middlewares/adminOnly";
import { authMiddleware } from "@/shared/middlewares/auth";

import {
  changePassword,
  createAddress,
  deleteAccount,
  deleteAddress,
  listAddresses,
  profile,
  searchCustomers,
  setDefault,
  updateAddress,
  updateProfile,
} from "./controllers";
import v from "./validators";

const userRouter: Router = Router();

userRouter.get("/users/profile", authMiddleware, profile);
userRouter.put("/users/profile", authMiddleware, v.updateProfile.middleware, updateProfile);
userRouter.put("/users/password", authMiddleware, v.changePassword.middleware, changePassword);
userRouter.delete("/users/account", authMiddleware, deleteAccount);
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

userRouter.get(
  "/admin/customers",
  authMiddleware,
  adminOnlyMiddleware,
  v.searchCustomers.middleware,
  searchCustomers
);

export { userRouter };
