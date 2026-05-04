"use client";
import { Heart, ShoppingCart } from "lucide-react";

import { BadgedIconButton } from "@/shared/components/BadgedIconButton";
import { UserMenu } from "@/shared/components/store/Header/UserMenu";
import { useCartState } from "@/shared/states/cart";
import { useWishlistState } from "@/shared/states/wishlist";

import { HeaderLogo } from "./Logo";
import { MobileSideMenu } from "./MobileSideMenu";
import { SearchInput } from "./SearchInput";

export const NavBar = () => {
  const { count: wishlistCount } = useWishlistState();
  const { count: cartCount } = useCartState();

  return (
    <nav className="flex h-12 items-center justify-center gap-3 lg:gap-6">
      <HeaderLogo />
      <SearchInput />
      <div className="flex items-center gap-2 lg:gap-3">
        {/* User Menu - Desktop */}
        <UserMenu />

        {/* Wishlist - Desktop and Mobile */}
        <BadgedIconButton
          icon={<Heart className="size-7 cursor-pointer stroke-2" />}
          count={wishlistCount}
          link="/wishlist"
        />

        {/* Cart - Desktop and Mobile */}
        <BadgedIconButton
          icon={<ShoppingCart className="size-7 cursor-pointer stroke-2" />}
          count={cartCount}
          link="/cart"
        />

        {/* Side Menu - Mobile */}
        <MobileSideMenu />
      </div>
    </nav>
  );
};
