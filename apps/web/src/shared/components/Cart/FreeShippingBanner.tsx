"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

import { TruckIcon } from "@/shared/assets/animatedIcons/truck";
import { useAnimatedIcon } from "@/shared/hooks/ui/useAnimatedIcon";
import { formatPrice } from "@/shared/utils/store/price";

const FREE_SHIPPING_THRESHOLD = 200;

type FreeShippingBannerProps = {
  total: number;
};

export const FreeShippingBanner = ({ total }: FreeShippingBannerProps) => {
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - total;
  const freeShippingProgress = Math.min(100, (total / FREE_SHIPPING_THRESHOLD) * 100);

  const { handleMouseEnter, handleMouseLeave, iconRef } = useAnimatedIcon();

  useEffect(() => {
    if (total < FREE_SHIPPING_THRESHOLD) return;

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
  }, [total]);

  return (
    <AnimatePresence mode="wait">
      {total < FREE_SHIPPING_THRESHOLD ? (
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
      ) : (
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
      )}
    </AnimatePresence>
  );
};
