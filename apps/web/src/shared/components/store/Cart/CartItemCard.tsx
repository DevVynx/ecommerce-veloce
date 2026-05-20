import type { CartItemDto } from "@repo/types/contracts";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

import { removeItemFromCart } from "@/shared/actions/cart/removeItem";
import { updateCartItemQuantity } from "@/shared/actions/cart/updateItem";
import { Button } from "@/shared/components/shadcn-ui/button";
import { CartItemQuantity } from "@/shared/components/store/Cart/CartItemQuantity";
import { useAuthState } from "@/shared/states/auth";
import { useCartState } from "@/shared/states/cart";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";
import { calculateDiscountPercent, formatPrice } from "@/shared/utils/store/price";

type CartItemCardProps = {
  item: CartItemDto;
};

export const CartItemCard = ({ item }: CartItemCardProps) => {
  const { isAuthenticated } = useAuthState();
  const { updateQuantity, removeItem, rollback } = useCartState();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    const prevQuantity = item.quantity;
    setIsLoading(true);

    updateQuantity(item.id, newQuantity);
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    const { error } = await authenticatedAction(updateCartItemQuantity, {
      cartItemId: item.id,
      quantity: newQuantity,
    });
    if (error) updateQuantity(item.id, prevQuantity);

    setIsLoading(false);
  };

  const handleRemove = useCallback(async () => {
    setIsLoading(true);
    removeItem(item.id);
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    const { error } = await removeItemFromCart({ cartItemId: item.id });
    if (error) rollback();
    setIsLoading(false);
  }, [item.id, removeItem, rollback]);

  const { price, salePrice, isOnSale } = item.product.variant;
  const displayPrice = isOnSale ? salePrice : price;

  const percentDiscount = isOnSale ? calculateDiscountPercent(price, salePrice) : 0;

  const itemTotal = displayPrice * item.quantity;

  return (
    <div className="flex h-38 gap-3 rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:h-auto sm:gap-4 sm:p-4">
      <div className="flex h-full w-28 cursor-pointer items-center justify-center sm:h-35 sm:w-35">
        {item.product.variant.image ? (
          <Link
            href={"#"}
            className="bg-muted relative flex h-28 w-28 overflow-hidden rounded-lg sm:h-35 sm:w-35"
          >
            <img
              src={item.product.variant.image}
              alt={item.product.title}
              className="h-full w-full object-contain p-1"
            />
            <span className="absolute top-1 right-1 rounded bg-red-500 px-1 py-0.5 text-[10px] font-bold text-white">
              -{percentDiscount}%
            </span>
          </Link>
        ) : null}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/product/${item.product.id}`}
              className="truncate text-sm leading-tight font-semibold hover:underline sm:text-base"
            >
              {item.product.title}
            </Link>
            <Button
              variant="ghost"
              onClick={handleRemove}
              disabled={isLoading}
              className="text-muted-foreground -mt-1.5 -mr-2 cursor-pointer p-1.5 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              aria-label="Remover item"
            >
              <Trash2 className="size-5" />
            </Button>
          </div>

          {item.selectedOptions[0] && (
            <div className="text-muted-foreground flex flex-col gap-0.5 text-xs sm:text-sm">
              {item.selectedOptions.map((opt) => (
                <span key={opt.name}>
                  <span className="font-bold">{opt.name}:</span> {opt.value}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold sm:text-base">{formatPrice(displayPrice)}</span>
            {isOnSale && (
              <span className="text-xs text-red-500 line-through">{formatPrice(price)}</span>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <CartItemQuantity
              value={item.quantity}
              onChange={handleQuantityChange}
              disabled={isLoading}
            />
            <span className="text-right text-sm font-bold sm:text-base">
              {formatPrice(itemTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
