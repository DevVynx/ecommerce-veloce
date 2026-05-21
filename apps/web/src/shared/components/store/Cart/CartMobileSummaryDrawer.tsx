import type { CartDto } from "@repo/types/contracts";
import { ChevronUp, Truck } from "lucide-react";

import { Button } from "@/shared/components/shadcn-ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/shared/components/shadcn-ui/drawer";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { formatDiscount, formatPrice } from "@/shared/utils/store/price";

import { CheckoutButton } from "./CheckoutButton";

const FREE_SHIPPING_THRESHOLD = 200;

type CartMobileSummaryDrawerProps = {
  summary: CartDto["summary"];
};

export const CartMobileSummaryDrawer = ({ summary }: CartMobileSummaryDrawerProps) => {
  const { count, subtotal, total, discount } = summary;

  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white px-4 py-4 shadow-lg lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">Total do pedido</span>
              <span className="text-2xl font-bold">{formatPrice(total)}</span>
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
          {total < FREE_SHIPPING_THRESHOLD ? (
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
          ) : (
            <div className="rounded-md bg-green-50 p-3 text-center text-xs font-semibold text-green-700">
              <Truck className="mx-auto mb-1 size-5" />
              Parabéns! Você ganhou <span className="font-bold">frete grátis</span>!
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

            {total < FREE_SHIPPING_THRESHOLD ? (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-muted-foreground text-xs">Calculado no checkout</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span className="font-medium text-green-600">Grátis</span>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between text-base">
            <span className="font-bold">Total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>

          <CheckoutButton buttonClassname="w-full py-3" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
