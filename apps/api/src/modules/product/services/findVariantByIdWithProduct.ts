import { productRepositories } from "@/modules/product/repositories";
import type { findVariantByIdWithProductParams } from "@/modules/product/types/ServiceParams";

export const findVariantByIdWithProduct = async ({
  variantId,
}: findVariantByIdWithProductParams) => {
  const variant = await productRepositories.findVariantByIdWithProduct({ variantId });
  return { variant };
};
