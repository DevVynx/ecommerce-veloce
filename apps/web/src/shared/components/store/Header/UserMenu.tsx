"use client";
import { User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/shadcn-ui/navigation-menu";
import { Skeleton } from "@/shared/components/shadcn-ui/skeleton";
import { useAuthState } from "@/shared/states/auth";

import { UserMenuContentAuthenticated } from "./UserMenuContentAuthenticated";
import { UserMenuContentUnauthenticated } from "./UserMenuContentUnauthenticated";

export const UserMenu = () => {
  const { isAuthenticated, hasHydrated, user } = useAuthState();

  return (
    <div className="hidden lg:flex">
      <NavigationMenu delayDuration={50} skipDelayDuration={100}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger asChild className="p-0 hover:bg-transparent">
              <Link href="/account">
                <Button variant="ghost" className="p-1">
                  <User className="size-7" />
                  <div className="flex max-w-22 flex-col truncate text-left text-xs">
                    <span className="inline-flex items-center">
                      Olá,{" "}
                      {hasHydrated ? (
                        isAuthenticated ? (
                          user?.name?.split(" ")[0]
                        ) : (
                          "Visitante"
                        )
                      ) : (
                        <Skeleton className="ml-1 h-3 w-12 rounded-sm bg-gray-200" />
                      )}
                    </span>

                    <strong>Minha conta</strong>
                  </div>
                </Button>
              </Link>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="w-50">
              {hasHydrated ? (
                isAuthenticated ? (
                  <UserMenuContentAuthenticated />
                ) : (
                  <UserMenuContentUnauthenticated />
                )
              ) : (
                <div className="flex h-32 w-56 items-center justify-center">
                  <Skeleton className="h-4 w-4/5 rounded-sm" />
                </div>
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
