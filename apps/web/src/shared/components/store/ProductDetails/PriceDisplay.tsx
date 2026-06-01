"use client";
import { useProductVariantContext } from "@/shared/context/ProductVariantContext";
import { formatPrice } from "@/shared/utils/store/price";

export const PriceDisplay = () => {
  const { displayPrice, displaySalePrice, displayIsOnSale } = useProductVariantContext();

  return (
    <div className="mb-4 flex items-center gap-3">
      <div className="text-3xl">{formatPrice(displaySalePrice)}</div>
      {displayIsOnSale && (
        <div>
          <span className="text-sm text-red-500 line-through">
            {formatPrice(displayPrice)}
          </span>
        </div>
      )}
    </div>
  );
};
