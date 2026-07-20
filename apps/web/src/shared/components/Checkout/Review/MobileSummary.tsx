import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { useCartState } from "@/shared/states/cart";
import { asDecimal, formatPrice } from "@/shared/utils/store/price";

type MobileSummaryProps = {
  shippingPrice: number;
};

export const MobileSummary = ({ shippingPrice }: MobileSummaryProps) => {
  const { cart, appliedCoupon } = useCartState();
  const { items, summary } = cart;

  const couponDiscount = appliedCoupon?.discount ?? 0;
  const finalTotal = asDecimal(summary.total).minus(couponDiscount).plus(shippingPrice);

  return (
    <div className="block rounded-lg border p-4 lg:hidden">
      <h3 className="mb-3 text-sm font-semibold tracking-wide uppercase">Itens do Pedido</h3>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="bg-muted relative size-12 shrink-0 overflow-hidden rounded-md">
              {item.product.variant.image && (
                <Image
                  src={item.product.variant.image}
                  alt={item.product.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm">{item.product.title}</p>
                <p className="text-muted-foreground text-xs">Qtd: {item.quantity}</p>
                <span className="shrink-0 text-sm">
                  {formatPrice(
                    (item.product.variant.isOnSale
                      ? item.product.variant.salePrice
                      : item.product.variant.price) * item.quantity
                  )}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-3" />

      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">{formatPrice(finalTotal)}</span>
      </div>

      <Link href="/cart">
        <Button type="button" variant="outline" className="w-full cursor-pointer">
          Voltar ao carrinho
        </Button>
      </Link>
    </div>
  );
};
