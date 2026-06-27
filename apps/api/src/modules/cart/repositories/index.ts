import { addCartItem } from "./addItem";
import { clearCart } from "./clearCart";
import { createCart } from "./createCart";
import { deleteCartItem } from "./deleteItem";
import { existsCartByUserId } from "./existsByUserId";
import { findCartByUserId } from "./findByUserId";
import { findCartItemById } from "./findItemById";
import { findCartItemByVariantId } from "./findItemByVariantId";
import { updateCartItemQuantity } from "./updateItemQuantity";

export const cartRepositories = {
  existsByUserId: existsCartByUserId,
  findByUserId: findCartByUserId,
  create: createCart,
  addItem: addCartItem,
  findItemByVariantId: findCartItemByVariantId,
  findItemById: findCartItemById,
  updateItemQuantity: updateCartItemQuantity,
  deleteItem: deleteCartItem,
  clearCart,
};
