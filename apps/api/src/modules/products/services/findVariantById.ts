import { productRepositories } from "@/modules/products/repositories";
import type { FindVariantByIdParams } from "@/modules/products/types/ServiceParams";

export const findVariantById = async ({ variantId }: FindVariantByIdParams) => {
  const variant = await productRepositories.findVariantById({ variantId });

  return variant;
};
