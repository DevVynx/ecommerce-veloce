"use client";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { CartIcon } from "@/shared/assets/animatedIcons/cart";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAnimatedIcon } from "@/shared/hooks/ui/useAnimatedIcon";

export const CartDropdownEmpty = () => {
  const { handleMouseEnter, handleMouseLeave, iconRef } = useAnimatedIcon();

  useEffect(() => {
    const startTimer = setTimeout(() => {
      iconRef.current?.startAnimation();
      setTimeout(() => {
        iconRef.current?.stopAnimation();
      }, 1000);
    }, 100);
    return () => {
      clearTimeout(startTimer);
    };
  }, [iconRef]);

  return (
    <div className="flex flex-col items-center justify-center gap-5 px-6 py-10">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-muted rounded-full p-4"
      >
        <CartIcon ref={iconRef} size={48} className="text-muted-foreground" />
      </div>

      <div className="space-y-1.5 text-center">
        <h3 className="text-xl font-semibold">Seu carrinho está vazio</h3>
        <p className="text-muted-foreground max-w-55 text-sm">
          Adicione produtos incríveis para começar suas compras
        </p>
      </div>

      <Button asChild variant="outline" size="sm">
        <Link href="/">
          <ShoppingBag className="size-4" />
          Continuar comprando
        </Link>
      </Button>
    </div>
  );
};
