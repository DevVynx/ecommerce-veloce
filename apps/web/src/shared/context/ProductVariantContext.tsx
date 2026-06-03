"use client";
import type {
  GetProductDetailsResponse,
  ProductOptionDto,
  VariantDto,
} from "@repo/types/contracts";
import { createContext, useContext } from "react";

import { useProductVariantSelection } from "@/shared/hooks/data/useProductVariantSelection";

type VariantContextType = {
  product: GetProductDetailsResponse["product"];
  variants: VariantDto[];
  options: ProductOptionDto[];
  selectedOptions: Record<string, string>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedVariant: VariantDto | null;
  currentSku: string;
  currentStock: number;
  isLowStock: boolean;
  displayPrice: number;
  displaySalePrice: number;
  displayIsOnSale: boolean;
  isOutOfStock: boolean;
};

const VariantContext = createContext<VariantContextType | null>(null);

type ProductVariantProviderProps = {
  data: GetProductDetailsResponse;
  children: React.ReactNode;
};

export const ProductVariantProvider = ({ data, children }: ProductVariantProviderProps) => {
  const { product, variants, options } = data;

  const displayVariantStock = variants.find((v) => v.id === product.display.variantId)?.stock ?? 0;
  const { selectedOptions, setSelectedOptions, selectedVariant } = useProductVariantSelection(
    variants,
    options,
    {
      variantId: product.display.variantId,
      price: product.display.price,
      salePrice: product.display.salePrice,
      stock: displayVariantStock,
      isOnSale: product.display.isOnSale,
      isAvailable: product.display.isAvailable,
    }
  );

  const isOutOfStock = !!selectedVariant && !selectedVariant.isAvailable;
  const currentSku = selectedVariant?.sku ?? variants[0]?.sku ?? "";
  const currentStock = selectedVariant?.stock ?? displayVariantStock;
  const isLowStock = currentStock > 0 && currentStock < 5;
  const displayPrice = selectedVariant?.price ?? product.display.price;
  const displaySalePrice = selectedVariant?.salePrice ?? product.display.salePrice;
  const displayIsOnSale = selectedVariant?.isOnSale ?? product.display.isOnSale;

  const value: VariantContextType = {
    product,
    variants,
    options,
    selectedOptions,
    setSelectedOptions,
    selectedVariant,
    currentSku,
    currentStock,
    isLowStock,
    displayPrice,
    displaySalePrice,
    displayIsOnSale,
    isOutOfStock,
  };

  return <VariantContext.Provider value={value}>{children}</VariantContext.Provider>;
};

export const useProductVariantContext = (): VariantContextType => {
  const context = useContext(VariantContext);
  if (!context) {
    throw new Error("useProductVariantContext must be used within a ProductVariantProvider");
  }
  return context;
};
