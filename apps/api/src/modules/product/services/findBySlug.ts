import { productRepositories } from "@/modules/product/repositories";
import type { FindProductBySlugParams } from "@/modules/product/types/ServiceParams";
import { NotFoundError } from "@/shared/utils/HttpErrors";
import { productLogic } from "@/shared/utils/productLogic";

export const findProductBySlug = async ({ slug }: FindProductBySlugParams) => {
  const rawProduct = await productRepositories.findBySlug({ slug });

  if (!rawProduct) {
    throw new NotFoundError("Produto não encontrado.");
  }

  const variantsWithEnrichment = rawProduct.productVariants.map((variant) => {
    const offer = productLogic.calculateEnrichment(variant, {
      variant: variant.promotions,
      product: rawProduct.promotions,
      category: rawProduct.category.promotions,
    });

    return {
      ...variant,
      offer,
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
