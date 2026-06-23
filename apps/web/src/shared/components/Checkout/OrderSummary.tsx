import Image from "next/image";
import Link from "next/link";

import { CouponApplier } from "@/shared/components/Cart/CouponApplier";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useCartState } from "@/shared/states/cart";
import { asDecimal, formatDiscount, formatPrice } from "@/shared/utils/store/price";

export const OrderSummary = () => {
  const { cart, appliedCoupon } = useCartState();
  const { items, summary } = cart;
  const { subtotal, total, discount } = summary;

  const couponDiscount = appliedCoupon?.discount ?? 0;
  const finalTotal = asDecimal(total).minus(couponDiscount);

  return (
    <div className="sticky top-24 rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold">Resumo do Pedido</h2>

      <div className="flex max-h-60 flex-col gap-4 overflow-y-scroll">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              {item.product.variant.image && (
                <Image
                  src={item.product.variant.image}
                  alt={item.product.title}
                  fill
                  className="object-contain p-1"
                />
              )}
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
              <Link
                href={`/product/${item.product.slug}`}
                className="truncate text-sm font-semibold hover:underline"
              >
                {item.product.title}
              </Link>

              {item.selectedOptions[0] && (
                <span className="text-muted-foreground truncate text-xs">
                  {item.selectedOptions.map((o) => o.value).join(", ")}
                </span>
              )}

              <span className="text-muted-foreground text-xs">Qtd: {item.quantity}</span>
            </div>

            <span className="shrink-0 text-sm font-semibold">
              {formatPrice(
                (item.product.variant.isOnSale
                  ? item.product.variant.salePrice
                  : item.product.variant.price) * item.quantity
              )}
            </span>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Desconto</span>
            <span className="font-semibold text-red-500">{formatDiscount(discount)}</span>
          </div>
        )}

        {appliedCoupon && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cupom ({appliedCoupon.code})</span>
            <span className="font-semibold text-red-500">
              {formatDiscount(appliedCoupon.discount)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Frete</span>
          <span className="text-muted-foreground text-xs">Calculado na próxima etapa</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-4 flex items-center justify-between text-base">
        <span className="font-bold">Total</span>
        <span className="text-xl font-bold">{formatPrice(finalTotal)}</span>
      </div>

      <CouponApplier subtotal={total} />
    </div>
  );
};
