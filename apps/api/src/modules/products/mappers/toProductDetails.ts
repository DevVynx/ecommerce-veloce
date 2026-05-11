import type { GetProductDetailsResponse } from "@repo/types/contracts";

import type { EnrichedProductDetails } from "@/modules/products/types/Enriched";

export function ProductMapperToProductDetails(
  enrichedProduct: EnrichedProductDetails
): GetProductDetailsResponse {
  const formattedProduct = {
    id: enrichedProduct.id,
    title: enrichedProduct.title,
    description: enrichedProduct.description,
    ratingRate: Number(enrichedProduct.ratingRate),
    ratingCount: Number(enrichedProduct.ratingCount),
    display: {
      variantId: enrichedProduct.heroVariant.id,
      image: enrichedProduct.image,
      price: Number(enrichedProduct.heroVariant.price),
      salePrice: Number(enrichedProduct.heroVariant.salePrice),
      isOnSale: enrichedProduct.heroVariant.isOnSale,
      isAvailable: enrichedProduct.heroVariant.isAvailable,
    },
  };

  const formattedOptions = enrichedProduct.productOptions.map((option) => ({
    id: option.id,
    name: option.name,
    values: option.values.map((value) => ({
      id: value.id,
      value: value.value,
    })),
  }));

  const formattedVariants = enrichedProduct.productVariants.map((variant) => ({
    id: variant.id,
    sku: variant.sku,
    price: Number(variant.price),
    salePrice: Number(variant.salePrice),
    isOnSale: variant.isOnSale,
    isAvailable: variant.isAvailable,
    optionValueIds: variant.productVariantOptions.map((vOpt) => vOpt.productOptionValueId),
  }));

  return { product: formattedProduct, options: formattedOptions, variants: formattedVariants };
}
