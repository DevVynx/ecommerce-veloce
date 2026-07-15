"use client";
import { Heart, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { getSearchSuggestions } from "@/shared/actions/search/getSuggestions";
import { registerSearchAnalytics } from "@/shared/actions/search/registerAnalytics";
import { BadgedIconButton } from "@/shared/components/BadgedIconButton";
import { SearchBar } from "@/shared/components/SearchBar";
import { Button } from "@/shared/components/shadcn-ui/button";
import { UserMenu } from "@/shared/components/Store/Header/UserMenu";
import { useAuthState } from "@/shared/states/auth";
import { useWishlistState } from "@/shared/states/wishlist";

import { CartDropdown } from "../../Cart/CartDropdown";
import { HeaderLogo } from "./Logo";
import { MobileSideMenu } from "./MobileSideMenu";

export const NavBar = () => {
  const { user } = useAuthState();
  const { count: wishlistCount } = useWishlistState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";

  const fetchSuggestions = async (query: string) => {
    const { data, error } = await getSearchSuggestions(query, 10);
    if (error || !data) {
      if (process.env.NODE_ENV === "development") console.error("fetchSuggestions error:", error);
      return [];
    }
    return data.suggestions.map((s) => ({ id: s.id, term: s.term }));
  };

  const handleSelect = async (term: string) => {
    await registerSearchAnalytics({ term });
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <nav className="flex h-12 items-center justify-center gap-3 lg:gap-6">
      <HeaderLogo />
      <SearchBar
        queryFromUrl={qFromUrl}
        placeholder="Busque os seus produtos!"
        fetchSuggestions={fetchSuggestions}
        onSelect={handleSelect}
        classNames={{
          root: "w-full",
          input: "border-primary focus-visible:ring-0",
          searchButton:
            "w-12 text-primary-foreground bg-primary hover:bg-primary/90 hover:text-primary-foreground/90",
        }}
      />
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

        <div className="hidden lg:block">
          {user?.role === "ADMIN" && (
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/dashboard">
                <LayoutDashboard className="size-4" />
                Painel Administrativo
              </Link>
            </Button>
          )}
        </div>

        {/* Side Menu - Mobile */}
        <MobileSideMenu />
      </div>
    </nav>
  );
};
