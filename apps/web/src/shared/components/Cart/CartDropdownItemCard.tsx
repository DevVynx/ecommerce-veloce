import type { CartItemDto } from "@repo/types/contracts";
import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

import { Button } from "@/shared/components/shadcn-ui/button";
import { useCartMutations } from "@/shared/hooks/data/useCartMutations";
import { calculateDiscountPercent, formatPrice } from "@/shared/utils/store/price";

type CartDropdownItemCardProps = {
  item: CartItemDto;
};

export const CartDropdownItemCard = ({ item }: CartDropdownItemCardProps) => {
  const { updateCartItemQuantity, removeItemFromCart, isLoading } = useCartMutations();

  const { price, salePrice, isOnSale } = item.product.variant;
  const displayPrice = isOnSale ? salePrice : price;
  const percentDiscount = isOnSale ? calculateDiscountPercent(price, salePrice) : 0;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > (item.product.variant.stock ?? 99)) return;
    updateCartItemQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeItemFromCart(item.id);
  };

  return (
    <div className="flex w-full gap-4">
      {/* Image */}
      <Link
        href={`/product/${item.product.slug}`}
        className="bg-muted h-24 w-24 shrink-0 overflow-hidden rounded-md"
      >
        {item.product.variant.image ? (
          <img
            src={item.product.variant.image}
            alt={item.product.title}
            className="h-full w-full object-cover"
          />
        ) : null}
      </Link>

      <div className="flex w-full min-w-0 flex-col justify-between">
        {/* Top block: Title + Remove + Options */}
        <div className="w-full space-y-1">
          <div className="flex w-full items-start justify-between gap-1">
            <Link
              href={`/product/${item.product.slug}`}
              className="truncate text-sm leading-tight font-medium hover:underline"
            >
              {item.product.title}
            </Link>
            <Button
              variant="ghost"
              onClick={handleRemove}
              disabled={isLoading}
              className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground cursor-pointer p-1 disabled:opacity-50"
              aria-label="Remover item"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          {item.selectedOptions[0] && (
            <div className="text-muted-foreground flex flex-col truncate text-xs">
              {item.selectedOptions.map((opt) => (
                <div className="flex gap-1" key={opt.name}>
                  <span className="font-bold">{opt.name}:</span>
                  <span> {opt.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom block: Price + Quantity — always at bottom */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="rounded-sm bg-red-500 px-1 py-0.5 text-[10px] font-bold text-white">
                -{percentDiscount}%
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={item.quantity <= 1 || isLoading}
              aria-label="Diminuir quantidade"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-6 text-center text-sm tabular-nums">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={item.quantity >= item.product.variant.stock || isLoading}
              aria-label="Aumentar quantidade"
            >
              <Plus className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
