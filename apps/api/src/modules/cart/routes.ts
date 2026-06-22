import { Router } from "express";

import {
  addItemToCart,
  findAllCartItems,
  findCart,
  removeItemFromCart,
  syncCart,
  updateCartItemQuantity,
} from "@/modules/cart/controllers";
import v from "@/modules/cart/validators";
import { authMiddleware } from "@/shared/middlewares/auth";

const cartRouter: Router = Router();

cartRouter.get("/cart", authMiddleware, findCart);
cartRouter.get("/cart/items", authMiddleware, findAllCartItems);
cartRouter.post("/cart/items", authMiddleware, v.addItemToCart.middleware, addItemToCart);
cartRouter.post("/cart/sync", authMiddleware, v.syncCart.middleware, syncCart);
cartRouter.patch(
  "/cart/items/:cartItemId/quantity",
  authMiddleware,
  v.updateCartItemQuantity.middleware,
  updateCartItemQuantity
);
cartRouter.delete(
  "/cart/items/:cartItemId",
  authMiddleware,
  v.removeItemFromCart.middleware,
  removeItemFromCart
);

export { cartRouter };
