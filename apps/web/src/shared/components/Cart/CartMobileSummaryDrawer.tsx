import type { CartDto } from "@repo/types/contracts";
import { ChevronUp, Truck } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/shadcn-ui/drawer";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useCartState } from "@/shared/states/cart";
import { formatDiscount, formatPrice } from "@/shared/utils/store/price";

import { CheckoutButton } from "./CheckoutButton";
import { CouponApplier } from "./CouponApplier";

const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_MIN_VALUE) || 200;

type CartMobileSummaryDrawerProps = {
  summary: CartDto["summary"];
};

export const CartMobileSummaryDrawer = ({ summary }: CartMobileSummaryDrawerProps) => {
  const { count, subtotal, total, discount } = summary;
  const { appliedCoupon } = useCartState();
  const [open, setOpen] = useState(false);
  const closeDrawer = useCallback(() => setOpen(false), []);

  const couponDiscount = appliedCoupon?.discount ?? 0;
  const finalTotal = total - couponDiscount;

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Total do pedido</span>
              <span className="text-2xl font-bold">{formatPrice(finalTotal)}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-sm">
                {count} {count === 1 ? "item" : "itens"}
              </span>
              <Button className="cursor-pointer gap-1.5 rounded-full">
                Ver resumo
                <ChevronUp className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader>
          <DrawerTitle>Resumo do Pedido</DrawerTitle>
        </DrawerHeader>

        <div className="space-y-4 overflow-y-auto px-4 pb-8">
          {appliedCoupon?.type === "FREE_SHIPPING" || total >= FREE_SHIPPING_THRESHOLD ? (
            <div className="rounded-md bg-green-50 p-3 text-center text-xs font-semibold text-green-700">
              <Truck className="mx-auto mb-1 size-5" />
              Parabéns! Você ganhou <span className="font-bold">frete grátis</span>!
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  className="h-full rounded-full bg-green-500 transition-all"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
              <p className="text-muted-foreground text-xs">
                Faltam{" "}
                <span className="text-foreground font-semibold">
                  {formatPrice(remainingForFreeShipping)}
                </span>{" "}
                para <span className="font-semibold text-green-600">frete grátis</span>
              </p>
            </div>
          )}

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Preço de varejo</span>
              <span className="text-muted-foreground">{formatPrice(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Desconto</span>
                <span className="font-medium text-red-500">{formatDiscount(discount)}</span>
              </div>
            )}

            {appliedCoupon?.type === "FREE_SHIPPING" || total >= FREE_SHIPPING_THRESHOLD ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-medium text-green-600">Grátis</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-muted-foreground text-xs">Calculado no checkout</span>
              </div>
            )}

            {appliedCoupon && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Cupom ({appliedCoupon.code})</span>
                {appliedCoupon.type === "FREE_SHIPPING" ? (
                  <span className="font-medium text-green-600">Frete Grátis</span>
                ) : (
                  <span className="font-medium text-red-500">
                    {formatDiscount(appliedCoupon.discount)}
                  </span>
                )}
              </div>
            )}
          </div>

          <CouponApplier subtotal={total} />

          <Separator />

          <div className="flex items-center justify-between text-base">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatPrice(finalTotal)}</span>
          </div>

          <CheckoutButton buttonClassname="w-full py-3" onBeforeNavigate={closeDrawer} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
