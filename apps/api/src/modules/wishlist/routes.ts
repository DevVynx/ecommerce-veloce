import { Router } from "express";

import {
  addItemToWishlist,
  getUserWishlist,
  removeItemFromWishlist,
} from "@/modules/wishlist/controllers";
import v from "@/modules/wishlist/validators";
import { authMiddleware } from "@/shared/middlewares/auth";

const wishlistRouter: Router = Router();

wishlistRouter.get("/wishlist", authMiddleware, getUserWishlist);
wishlistRouter.post(
  "/wishlist/items",
  authMiddleware,
  v.addItemToWishlist.middleware,
  addItemToWishlist
);
wishlistRouter.delete(
  "/wishlist/items/:productId",
  authMiddleware,
  v.removeItemFromWishlist.middleware,
  removeItemFromWishlist
);

export { wishlistRouter };
