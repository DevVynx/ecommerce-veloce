import { ShoppingCart } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { formatDiscount, formatPrice } from "@/shared/utils/store/price";

type CartDropdownSummaryProps = {
  subtotal: number;
  discount: number;
  total: number;
};

export const CartDropdownSummary = ({ subtotal, discount, total }: CartDropdownSummaryProps) => {
  return (
    <div className="space-y-2 p-4 pt-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground font-semibold">Preço de varejo:</span>
        <span className="font-semibold">{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground font-semibold">Desconto:</span>
          <span className="font-semibold text-red-500">{formatDiscount(discount)}</span>
        </div>
      )}
      <Separator />
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">Total:</span>
        <span className="font-bold">{formatPrice(total)}</span>
      </div>
      <Button asChild className="w-full">
        <Link href="/cart">
          <ShoppingCart className="size-4" />
          Ver carrinho
        </Link>
      </Button>
    </div>
  );
};
