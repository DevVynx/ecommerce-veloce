"use client";
import { Heart, LayoutDashboard } from "lucide-react";
import { Meilisearch } from "meilisearch";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { registerSearchAnalytics } from "@/shared/actions/search/registerAnalytics";
import { BadgedIconButton } from "@/shared/components/BadgedIconButton";
import { SearchBar } from "@/shared/components/SearchBar";
import { Button } from "@/shared/components/shadcn-ui/button";
import { UserMenu } from "@/shared/components/Store/Header/UserMenu";
import { useAuthState } from "@/shared/states/auth";
import { useWishlistState } from "@/shared/states/wishlist";
import { ENV } from "@/shared/utils/env";

import { CartDropdown } from "../../Cart/CartDropdown";
import { HeaderLogo } from "./Logo";
import { MobileSideMenu } from "./MobileSideMenu";

const meiliClient = new Meilisearch({
  host: ENV.NEXT_PUBLIC_MEILI_HOST,
  apiKey: ENV.NEXT_PUBLIC_MEILI_SEARCH_KEY,
});

export const NavBar = () => {
  const { user } = useAuthState();
  const { count: wishlistCount } = useWishlistState();
  const router = useRouter();
  const searchParams = useSearchParams();
  const qFromUrl = searchParams.get("q") ?? "";

  const fetchSuggestions = async (query: string) => {
    const result = await meiliClient.index("suggestions").search(query, { limit: 10 });
    return result.hits.map((hit) => ({ id: String(hit.id), term: String(hit.term) }));
  };

  const fetchTrending = async () => {
    const result = await meiliClient.index("suggestions").search("", {
      sort: ["searchCount:desc"],
      limit: 5,
    });
    return result.hits.map((hit) => ({ id: String(hit.id), term: String(hit.term) }));
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
        fetchTrending={fetchTrending}
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
