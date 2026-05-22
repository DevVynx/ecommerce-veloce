"use client";
import { Heart } from "lucide-react";

import { BadgedIconButton } from "@/shared/components/BadgedIconButton";
import { UserMenu } from "@/shared/components/store/Header/UserMenu";
import { useWishlistState } from "@/shared/states/wishlist";

import { CartDropdown } from "../../Cart/CartDropdown";
import { HeaderLogo } from "./Logo";
import { MobileSideMenu } from "./MobileSideMenu";
import { SearchInput } from "./SearchInput";

export const NavBar = () => {
  const { count: wishlistCount } = useWishlistState();

  return (
    <nav className="flex h-12 items-center justify-center gap-3 lg:gap-6">
      <HeaderLogo />
      <SearchInput />
      <div className="flex items-center gap-2 lg:gap-3">
        {/* User Menu - Desktop */}
        <UserMenu />

        {/* Cart - Desktop and Mobile */}
        <CartDropdown />

        {/* Wishlist - Desktop and Mobile */}
        <BadgedIconButton
          icon={<Heart className="size-7 cursor-pointer stroke-2" />}
          count={wishlistCount}
          link="/wishlist"
        />

        {/* Side Menu - Mobile */}
        <MobileSideMenu />
      </div>
    </nav>
  );
};
