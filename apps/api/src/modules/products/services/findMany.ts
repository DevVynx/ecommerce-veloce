import { productRepositories } from "@/modules/products/repositories";
import type { FindAllProductsParams } from "@/modules/products/types/ServiceParams";
import { productLogic } from "@/shared/utils/productLogic";

export const findManyProducts = async ({
  categoryId,
  limit,
  offset,
  onlyAvailable,
  onSale,
}: FindAllProductsParams) => {
  const rawProducts = await productRepositories.findMany({
    categoryId,
    limit,
    offset,
    onlyAvailable,
  });

  const enrichedProducts = rawProducts
    .map((product) => {
      const variantsWithEnrichment = product.productVariants.map((variant) => {
        const enrichment = productLogic.calculateEnrichment(variant, {
          variant: variant.promotions,
          product: product.promotions,
          category: product.category.promotions,
        });

        return {
          ...variant,
          ...enrichment,
        };
      });

      const heroVariant = productLogic.pickHeroVariant(variantsWithEnrichment);

      if (!heroVariant) return null;

      return {
        ...product,
        productVariants: variantsWithEnrichment,
        heroVariant,
      };
    })
    .filter((p) => p !== null);

  if (onSale) return { products: enrichedProducts.filter((p) => p.heroVariant.isOnSale) };

  return { products: enrichedProducts };
};
