import { Lock } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/shared/assets/logo/BeliLogoNoBg";

export const CheckoutHeader = () => {
  return (
    <header className="bg-background border-border border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex shrink-0 cursor-pointer items-center gap-1 font-bold">
          <Logo />
          <h1 className="font-kotta hidden text-3xl md:inline-block">BeliBeli.com</h1>
        </Link>

        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <Lock className="size-4" />
          <span className="font-semibold">Checkout Seguro</span>
        </div>
      </div>
    </header>
  );
};
