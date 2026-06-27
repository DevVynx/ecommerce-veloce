import { addCartItem } from "./addItem";
import { clearCart } from "./clearCart";
import { deleteCartItem } from "./deleteCartItem";
import { findCartByUserId } from "./findByUserId";
import { getCartItems } from "./findItemsByUserId";
import { syncCart } from "./syncCart";
import { updateCartItemQuantity } from "./updateItemQuantity";

export const cartServices = {
  findCartByUserId,
  getCartItems,
  addCartItem,
  syncCart,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
};
