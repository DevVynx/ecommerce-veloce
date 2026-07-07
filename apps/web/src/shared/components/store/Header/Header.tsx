"use client";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

import { useScrollDirection } from "@/shared/hooks/ui/useScrollDirection";

import { NavBar } from "./NavBar";

export function Header() {
  const pathname = usePathname();
  const scrollDir = useScrollDirection();

  const hideHeaderRoutes = ["/checkout", "/login", "/register", "/admin"];
  const shouldHideHeader = hideHeaderRoutes.some((route) => pathname.startsWith(route));

  if (shouldHideHeader) {
    return null;
  }

  const isHidden = scrollDir === "down";

  const translateYClass = isHidden ? "-translate-y-full" : "translate-y-0";

  return (
    <header
      className={`bg-background fixed top-0 right-0 left-0 z-5 h-16 px-4 py-2 inset-shadow-2xs transition-transform duration-300 ease-in-out ${translateYClass} `}
    >
      <div className="mx-auto lg:container">
        <Suspense fallback={null}>
          <NavBar />
        </Suspense>
      </div>
    </header>
  );
}
