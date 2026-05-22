import { productRepositories } from "@/modules/products/repositories";
import type { FindProductByIdParams } from "@/modules/products/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";
import { productLogic } from "@/shared/utils/productLogic";

export const findProductById = async ({ productId }: FindProductByIdParams) => {
  const rawProduct = await productRepositories.findById({ productId });

  if (!rawProduct) {
    throw new NotFoundError("Produto não encontrado.");
  }

  const variantsWithEnrichment = rawProduct.productVariants.map((variant) => {
    const enrichment = productLogic.calculateEnrichment(variant, {
      variant: variant.promotions,
      product: rawProduct.promotions,
      category: rawProduct.category.promotions,
    });

    return {
      ...variant,
      ...enrichment,
    };
  });

  const heroVariant = productLogic.pickHeroVariant(variantsWithEnrichment);

  if (!heroVariant) {
    throw new NotFoundError("Nenhuma variante ativa encontrada para este produto.");
  }

  const enrichedProduct = {
    ...rawProduct,
    productVariants: variantsWithEnrichment,
    heroVariant,
  };

  return { enrichedProduct };
};
