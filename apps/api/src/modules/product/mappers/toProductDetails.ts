import type { GetProductDetailsResponse } from "@repo/types/contracts";

import type { EnrichedProductDetail } from "@/modules/product/types/ProductDetail";

export function productMapperToProductDetails(
  enrichedProduct: EnrichedProductDetail
): GetProductDetailsResponse {
  const formattedProduct = {
    id: enrichedProduct.id,
    slug: enrichedProduct.slug,
    title: enrichedProduct.title,
    description: enrichedProduct.description,
    ratingRate: Number(enrichedProduct.ratingRate),
    ratingCount: Number(enrichedProduct.ratingCount),
    ratingDistribution: enrichedProduct.ratingDistribution,
    display: {
      variantId: enrichedProduct.heroVariant.id,
      image: enrichedProduct.heroVariant.images[0]?.url ?? "",
      price: Number(enrichedProduct.heroVariant.price),
      salePrice: Number(enrichedProduct.heroVariant.offer.salePrice),
      isOnSale: enrichedProduct.heroVariant.offer.isOnSale,
      isAvailable: enrichedProduct.heroVariant.offer.isAvailable,
    },
    category: {
      id: enrichedProduct.category.id,
      name: enrichedProduct.category.name,
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
    salePrice: Number(variant.offer.salePrice),
    stock: variant.stock,
    isOnSale: variant.offer.isOnSale,
    isAvailable: variant.offer.isAvailable,
    optionValueIds: variant.optionValues.map((vOpt) => vOpt.productOptionValueId),
    images: variant.images.map((img) => ({ url: img.url })),
  }));

  return { product: formattedProduct, options: formattedOptions, variants: formattedVariants };
}
