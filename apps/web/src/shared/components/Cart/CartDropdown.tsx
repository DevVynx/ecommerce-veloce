"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { Badge } from "@/shared/components/shadcn-ui/badge";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Separator } from "@/shared/components/shadcn-ui/separator";
import { CartDropdownEmpty } from "@/shared/components/Cart/CartDropdownEmpty";
import { CartDropdownItemCard } from "@/shared/components/Cart/CartDropdownItemCard";
import { CartDropdownSummary } from "@/shared/components/Cart/CartDropdownSummary";
import { useCartState } from "@/shared/states/cart";

export const CartDropdown = () => {
  const { cart } = useCartState();
  const [isOpen, setIsOpen] = useState(false);
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

  const { subtotal, total, discount, count } = cart.summary;

  return (
    <div ref={triggerRef} onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      {/* Trigger - Cart Icon */}
      <Button variant="ghost" className="relative p-1" asChild>
        <Link href="/cart" onClick={() => setIsOpen(false)}>
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
            {cart.items.length === 0 ? (
              <CartDropdownEmpty />
            ) : (
              <div className="flex flex-col">
                {/* Items List */}
                <div className="max-h-80 space-y-5 overflow-y-auto p-4">
                  {cart.items.map((item) => (
                    <CartDropdownItemCard key={item.id} item={item} />
                  ))}
                </div>

                <Separator />

                <CartDropdownSummary
                  onNavigateToCart={setIsOpen}
                  subtotal={subtotal}
                  discount={discount}
                  total={total}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
