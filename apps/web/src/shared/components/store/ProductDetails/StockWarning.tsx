"use client";
import { useProductVariantContext } from "@/shared/context/ProductVariantContext";

export const StockWarning = () => {
  const { currentStock, isLowStock } = useProductVariantContext();

  if (!isLowStock) return null;

  return (
    <p className="mb-4 font-mono text-xs tracking-widest text-amber-600 uppercase">
      Apenas {currentStock} {currentStock === 1 ? "unidade restante" : "unidades restantes"}
    </p>
  );
};
