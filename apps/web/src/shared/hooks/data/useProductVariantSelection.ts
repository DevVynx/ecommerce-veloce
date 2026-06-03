"use client";
import type { ProductOptionDto, VariantDto } from "@repo/types/contracts";
import { useEffect, useMemo, useState } from "react";

type DisplayVariant = {
  variantId: string;
  price: number;
  salePrice: number;
  stock: number;
  isOnSale: boolean;
  isAvailable: boolean;
};

export function useProductVariantSelection(
  variants: VariantDto[],
  options: ProductOptionDto[],
  displayVariant: DisplayVariant
) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    const displayVariantObj = variants.find((v) => v.id === displayVariant.variantId);

    if (displayVariantObj) {
      for (const option of options) {
        const valueId = displayVariantObj.optionValueIds.find((id) =>
          option.values.some((v) => v.id === id)
        );
        if (valueId) {
          initial[option.id] = valueId;
        }
      }
    }

    setSelectedOptions(initial);
  }, [displayVariant.variantId, options, variants]);

  const selectedVariant = useMemo((): VariantDto | null => {
    if (options.length === 0) {
      return {
        id: displayVariant.variantId,
        sku: "",
        price: displayVariant.price,
        salePrice: displayVariant.salePrice,
        stock: displayVariant.stock,
        isOnSale: displayVariant.isOnSale,
        isAvailable: displayVariant.isAvailable,
        optionValueIds: [],
      };
    }

    const selectedValueIds = Object.values(selectedOptions);
    if (selectedValueIds.length !== options.length) return null;

    return (
      variants.find((variant) => {
        if (variant.optionValueIds.length !== selectedValueIds.length) return false;
        return variant.optionValueIds.every((id) => selectedValueIds.includes(id));
      }) || null
    );
  }, [variants, options, selectedOptions, displayVariant]);

  const isComplete = selectedVariant !== null;

  return { selectedOptions, setSelectedOptions, selectedVariant, isComplete };
}
