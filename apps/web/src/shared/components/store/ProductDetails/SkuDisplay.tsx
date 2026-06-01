"use client";
import { useProductVariantContext } from "@/shared/context/ProductVariantContext";

export const SkuDisplay = () => {
  const { currentSku } = useProductVariantContext();

  return (
    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
      SKU: {currentSku}
    </span>
  );
};
