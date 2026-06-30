import { productRepositories } from "@/modules/product/repositories";
import type { FindVariantByIdParams } from "@/modules/product/types/ServiceParams";

export const findVariantById = async ({ variantId }: FindVariantByIdParams) => {
  const variant = await productRepositories.findVariantById({ variantId });

  return { variant };
};
