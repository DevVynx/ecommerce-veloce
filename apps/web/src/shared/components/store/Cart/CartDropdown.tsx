"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { removeItemFromCart } from "@/shared/actions/cart/removeItem";
import { updateCartItemQuantity } from "@/shared/actions/cart/updateItem";
import { Badge } from "@/shared/components/shadcn-ui/badge";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { CartDropdownEmpty } from "@/shared/components/store/Cart/CartDropdownEmpty";
import { useCartState } from "@/shared/states/cart";
import { calculateDiscountPercent, formatDiscount, formatPrice } from "@/shared/utils/store/price";

export const CartDropdown = () => {
  const { cart, updateQuantity, removeItem, rollback } = useCartState();
  const items = cart.items;
  const count = cart.summary.count;
  const [isOpen, setIsOpen] = useState(false);
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [dropdownTop, setDropdownTop] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const recalcPosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownTop(rect.bottom + 4);
    }
  }, []);

  const handleOpen = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    recalcPosition();
    setIsOpen(true);
  }, [recalcPosition]);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 250);
  }, []);

  const handleQuantityChange = useCallback(
    async (cartItemId: string, newQuantity: number) => {
      if (newQuantity < 1) return;
      setLoadingItems((prev) => new Set(prev).add(cartItemId));
      updateQuantity(cartItemId, newQuantity);
      const { error } = await updateCartItemQuantity({
        cartItemId,
        quantity: newQuantity,
      });
      if (error) {
        const item = items.find((i) => i.id === cartItemId);
        if (item) {
          const prevQty = item.quantity;
          updateQuantity(cartItemId, prevQty);
        }
      }
      setLoadingItems((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    },
    [updateQuantity, items]
  );

  const handleRemove = useCallback(
    async (cartItemId: string) => {
      setLoadingItems((prev) => new Set(prev).add(cartItemId));
      removeItem(cartItemId);
      const { error } = await removeItemFromCart({ cartItemId });
      if (error) {
        rollback();
      }
      setLoadingItems((prev) => {
        const next = new Set(prev);
        next.delete(cartItemId);
        return next;
      });
    },
    [removeItem, rollback]
  );

  const { subtotal, total, discount } = cart.summary;

  return (
    <div ref={triggerRef} onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      {/* Trigger - Cart Icon */}
      <Button variant="ghost" className="relative p-1" asChild>
        <Link href="/cart">
          <ShoppingCart className="size-7 stroke-2" />
          {count > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] font-bold"
            >
              {count > 99 ? "99+" : count}
            </Badge>
          )}
        </Link>
      </Button>

      {/* Dropdown - Fixed position, glued to right edge */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{ top: dropdownTop }}
            className="bg-popover text-popover-foreground fixed right-4 z-50 w-110 max-w-[calc(100vw-32px)] origin-top-right rounded-md border shadow-lg"
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            {/* Empty State */}
            {items.length === 0 ? (
              <CartDropdownEmpty />
            ) : (
              <div className="flex flex-col">
                {/* Items List */}
                <div className="max-h-80 space-y-5 overflow-y-auto p-4">
                  {items.map((item) => {
                    const { price, salePrice, isOnSale } = item.product.variant;
                    const displayPrice = isOnSale ? salePrice : price;
                    const percentDiscount = isOnSale
                      ? calculateDiscountPercent(price, salePrice)
                      : 0;
                    const isLoading = loadingItems.has(item.id);

                    return (
                      <div key={item.id} className="flex items-center gap-4">
                        {/* Image */}
                        <div className="bg-muted h-24 w-24 shrink-0 rounded-md p-1">
                          {item.product.variant.image ? (
                            <img
                              src={item.product.variant.image}
                              alt={item.product.title}
                              className="aspect-square w-full object-contain"
                            />
                          ) : null}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-between gap-1">
                          {/* Top block: Title + Remove + Options */}
                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-1">
                              <div className="min-w-0 truncate text-sm font-medium">
                                {item.product.title}
                              </div>
                              <Button
                                variant="ghost"
                                onClick={() => handleRemove(item.id)}
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
                              <span className="text-sm font-semibold">
                                {formatPrice(displayPrice)}
                              </span>
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
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || isLoading}
                                aria-label="Diminuir quantidade"
                              >
                                <Minus className="size-3" />
                              </Button>
                              <span className="w-6 text-center text-sm tabular-nums">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                aria-label="Aumentar quantidade"
                              >
                                <Plus className="size-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Footer - Summary + Cart Link */}
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
