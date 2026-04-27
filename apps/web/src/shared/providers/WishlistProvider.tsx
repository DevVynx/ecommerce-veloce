"use client";
import { useEffect } from "react";

import { getWishlist } from "@/shared/actions/wishlist/getWishlist";
import { useAuthState } from "@/shared/states/auth";
import { useWishlistState } from "@/shared/states/wishlist";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

export function WishlistProvider() {
  const { hydrate } = useWishlistState();
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadWishlist = async () => {
      const { data } = await authenticatedAction(getWishlist);
      if (data?.wishlist?.items) {
        hydrate(data.wishlist.items);
      }
    };

    loadWishlist();
  }, [hydrate, isAuthenticated]);

  return null;
}
