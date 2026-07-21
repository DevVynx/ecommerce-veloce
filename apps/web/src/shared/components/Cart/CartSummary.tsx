import type { CartDto } from "@repo/types/contracts";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useCartState } from "@/shared/states/cart";
import { formatDiscount, formatPrice } from "@/shared/utils/store/price";

import { CheckoutButton } from "./CheckoutButton";
import { CouponApplier } from "./CouponApplier";
import { FreeShippingBanner } from "./FreeShippingBanner";

const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_MIN_VALUE) || 200;

type CartSummaryProps = {
  summary: CartDto["summary"];
};

export const CartSummary = ({ summary }: CartSummaryProps) => {
  const { subtotal, total, discount } = summary;
  const { appliedCoupon } = useCartState();

  const couponDiscount = appliedCoupon?.discount ?? 0;
  const finalTotal = total - couponDiscount;

  return (
    <div className="sticky top-24 rounded-xl border bg-white shadow-sm">
      <div className="p-6">
        <h2 className="mb-5 text-lg font-bold">Resumo do Pedido</h2>

        <FreeShippingBanner total={total} />

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Preço de varejo</span>
            <span className="text-muted-foreground">{formatPrice(subtotal)}</span>
          </div>

          {discount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Desconto em promoção</span>
              <span className="font-semibold text-red-500">{formatDiscount(discount)}</span>
            </div>
          )}

          {appliedCoupon && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cupom ({appliedCoupon.code})</span>
              {appliedCoupon.type === "FREE_SHIPPING" ? (
                <span className="font-semibold text-green-600">Frete Grátis</span>
              ) : (
                <span className="font-semibold text-red-500">
                  {formatDiscount(appliedCoupon.discount)}
                </span>
              )}
            </div>
          )}

          {appliedCoupon?.type === "FREE_SHIPPING" || total >= FREE_SHIPPING_THRESHOLD ? (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span className="font-semibold text-green-600">Grátis</span>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-muted-foreground text-xs">Calculado no checkout</span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        <div className="mb-4 flex items-center justify-between text-base">
          <span className="font-bold">Total</span>
          <span className="text-xl font-bold">{formatPrice(finalTotal)}</span>
        </div>

        <CouponApplier subtotal={total} />

        <div className="mt-6 space-y-3">
          <CheckoutButton buttonClassname="w-full cursor-pointer" />
          <Button variant="outline" className="w-full cursor-pointer" asChild>
            <Link href="/#bestOffersSection">
              <ShoppingBag className="size-4" />
              Continuar Comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
