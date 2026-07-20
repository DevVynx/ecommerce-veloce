import Image from "next/image";
import Link from "next/link";

import { CouponApplier } from "@/shared/components/Cart/CouponApplier";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useCartState } from "@/shared/states/cart";
import { useCheckoutState } from "@/shared/states/checkout";
import { asDecimal, formatDiscount, formatPrice } from "@/shared/utils/store/price";

export const OrderSummary = () => {
  const { cart, appliedCoupon } = useCartState();
  const { items, summary } = cart;
  const { subtotal, total, discount } = summary;

  const { selectedShipping, step } = useCheckoutState();

  const couponDiscount = appliedCoupon?.discount ?? 0;
  const shippingPrice = selectedShipping?.price ?? 0;
  const finalTotal = asDecimal(total).minus(couponDiscount).plus(shippingPrice);

  return (
    <div className="sticky top-24 flex max-h-[calc(100dvh-8rem)] flex-col overflow-hidden rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 shrink-0 text-lg font-bold">Resumo do Pedido</h2>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <Link
              href={`/product/${item.product.slug}`}
              className="bg-muted relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg"
            >
              {item.product.variant.image && (
                <Image
                  src={item.product.variant.image}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col justify-between gap-0.5">
              <Link
                href={`/product/${item.product.slug}`}
                className="truncate text-sm font-semibold hover:underline"
              >
                {item.product.title}
              </Link>

              {item.selectedOptions[0] && (
                <span className="text-muted-foreground truncate text-xs font-medium">
                  {item.selectedOptions.map((o) => o.value).join(", ")}
                </span>
              )}

              <span className="text-muted-foreground text-xs font-medium">
                Qtd: {item.quantity}
              </span>
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

        {selectedShipping ? (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{selectedShipping.service}</span>
            {selectedShipping.price === 0 ? (
              <span className="font-semibold text-green-600">Grátis</span>
            ) : (
              <span>{formatPrice(selectedShipping.price)}</span>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Frete</span>
            <span className="text-muted-foreground text-xs">
              {step === "shipping" ? "Selecione o método de envio" : "Calculado na próxima etapa"}
            </span>
          </div>
        )}
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
