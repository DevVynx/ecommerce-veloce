"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { TruckIcon } from "@/shared/assets/animatedIcons/truck";
import { useAnimatedIcon } from "@/shared/hooks/ui/useAnimatedIcon";
import { useCartState } from "@/shared/states/cart";
import { formatPrice } from "@/shared/utils/store/price";

const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_MIN_VALUE) || 200;

type FreeShippingBannerProps = {
  total: number;
};

export const FreeShippingBanner = ({ total }: FreeShippingBannerProps) => {
  const { appliedCoupon } = useCartState();
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);
  const hasFreeShipping = appliedCoupon?.type === "FREE_SHIPPING" || total >= FREE_SHIPPING_THRESHOLD;

  const { handleMouseEnter, handleMouseLeave, iconRef } = useAnimatedIcon();

  useEffect(() => {
    if (!hasFreeShipping) return;

    const startTimer = setTimeout(() => {
      iconRef.current?.startAnimation();
    }, 400);

    const stopTimer = setTimeout(() => {
      iconRef.current?.stopAnimation();
    }, 2200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [hasFreeShipping]);

  return (
    <AnimatePresence mode="wait">
      {hasFreeShipping ? (
        <motion.div
          key="congrats"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 250, damping: 18 }}
          className="bg-muted mb-5 rounded-lg p-3 text-center text-sm font-semibold text-green-700"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <TruckIcon className="mx-auto mb-1 size-6" ref={iconRef} />
          Parabéns! Você ganhou <span className="font-bold">frete grátis</span>!
        </motion.div>
      ) : (
        <motion.div
          key="progress"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="bg-muted mb-5 space-y-1.5 rounded-lg p-3"
        >
          <div className="bg-border h-2 w-full overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Faltam{" "}
            <span className="font-bold text-green-600">
              {formatPrice(remainingForFreeShipping)}
            </span>{" "}
            para <span className="font-bold text-green-600">frete grátis</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
