import { findProductById } from "@/modules/product/repositories/findById";
import { findProductsByIds } from "@/modules/product/repositories/findByIds";
import { findProductBySlug } from "@/modules/product/repositories/findBySlug";
import { findCategoryNamesByIds } from "@/modules/product/repositories/findCategoryNamesByIds";
import { findManyProducts } from "@/modules/product/repositories/findMany";
import { findProductIdsByOptionValues } from "@/modules/product/repositories/findProductIdsByOptionValues";
import { findVariantById } from "@/modules/product/repositories/findVariantById";
import { findVariantByIdWithProduct } from "@/modules/product/repositories/findVariantByIdWithProduct";

export const productRepositories = {
  findMany: findManyProducts,
  findById: findProductById,
  findByIds: findProductsByIds,
  findBySlug: findProductBySlug,
  findVariantById: findVariantById,
  findVariantByIdWithProduct: findVariantByIdWithProduct,
  findProductIdsByOptionValues,
  findCategoryNamesByIds,
};
