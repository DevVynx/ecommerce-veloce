import type { CatalogProductDto } from "@repo/types/contracts";

import type { EnrichedProductList } from "@/modules/product/types/ProductList";

export function ProductMapperToCatalogSummary(products: EnrichedProductList): {
  products: CatalogProductDto[];
} {
  const formattedProducts = products.map((product) => {
    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      description: product.description,
      ratingRate: Number(product.ratingRate),
      ratingCount: Number(product.ratingCount),
      display: {
        variantId: product.heroVariant.id,
        image: product.image,
        price: Number(product.heroVariant.price),
        salePrice: Number(product.heroVariant.offer.salePrice),
        isOnSale: product.heroVariant.offer.isOnSale,
        isAvailable: product.heroVariant.offer.isAvailable,
      },
    };
  });

  return { products: formattedProducts };
}
