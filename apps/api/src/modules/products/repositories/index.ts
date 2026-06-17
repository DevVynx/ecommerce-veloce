import { findProductById } from "@/modules/products/repositories/findById";
import { findProductsByIds } from "@/modules/products/repositories/findByIds";
import { findProductBySlug } from "@/modules/products/repositories/findBySlug";
import { findCategoryNamesByIds } from "@/modules/products/repositories/findCategoryNamesByIds";
import { findManyProducts } from "@/modules/products/repositories/findMany";
import { findProductIdsByOptionValues } from "@/modules/products/repositories/findProductIdsByOptionValues";
import { findVariantById } from "@/modules/products/repositories/findVariantById";
import { findVariantByIdWithProduct } from "@/modules/products/repositories/findVariantByIdWithProduct";

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
