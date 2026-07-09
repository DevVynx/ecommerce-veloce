"use client";
import { useEffect } from "react";

import { getWishlist } from "@/shared/actions/wishlist/getWishlist";
import { useAuthState } from "@/shared/states/auth";
import { useWishlistState } from "@/shared/states/wishlist";

export function WishlistProvider() {
  const { hydrate } = useWishlistState();
  const { isAuthenticated } = useAuthState();

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadWishlist = async () => {
      const { data } = await getWishlist();
      if (data?.wishlist?.items) {
        hydrate(data.wishlist.items);
      }
    };

    loadWishlist();
  }, [hydrate, isAuthenticated]);

  return null;
}
