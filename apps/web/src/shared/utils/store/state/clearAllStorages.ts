import { useAuthState } from "@/shared/states/auth";
import { useCartState } from "@/shared/states/cart";
import { useWishlistState } from "@/shared/states/wishlist";

export function clearAllStorages() {
  const clearUser = useAuthState.getState().clearUser;
  const clearWishlist = useWishlistState.getState().clear;
  const clearCart = useCartState.getState().clear;

  clearUser();
  clearWishlist();
  clearCart();
}
