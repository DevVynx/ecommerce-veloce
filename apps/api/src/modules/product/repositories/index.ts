import { countLowStockVariants } from "@/modules/product/repositories/countLowStockVariants";
import { findAdminProductsByFilters } from "@/modules/product/repositories/findAdminProductsByFilters";
import { findAllCategories } from "@/modules/product/repositories/findAllCategories";
import { findProductById } from "@/modules/product/repositories/findById";
import { findProductsByIds } from "@/modules/product/repositories/findByIds";
import { findProductBySlug } from "@/modules/product/repositories/findBySlug";
import { findCategoryNamesByIds } from "@/modules/product/repositories/findCategoryNamesByIds";
import { findManyProducts } from "@/modules/product/repositories/findMany";
import { findProductIdsByOptionValues } from "@/modules/product/repositories/findProductIdsByOptionValues";
import { findProductsAdmin } from "@/modules/product/repositories/findProductsAdmin";
import { findVariantById } from "@/modules/product/repositories/findVariantById";
import { findVariantByIdWithProduct } from "@/modules/product/repositories/findVariantByIdWithProduct";
import { getRatingDistribution } from "@/modules/product/repositories/getRatingDistribution";
import { updateRatingAggregates } from "@/modules/product/repositories/updateRatingAggregates";

export const productRepositories = {
  findProductsAdmin,
  findAllCategories,
  findAdminProductsByFilters,
  findMany: findManyProducts,
  findById: findProductById,
  findByIds: findProductsByIds,
  findBySlug: findProductBySlug,
  findVariantById: findVariantById,
  findVariantByIdWithProduct: findVariantByIdWithProduct,
  findProductIdsByOptionValues,
  findCategoryNamesByIds,
  getRatingDistribution,
  updateRatingAggregates,
  countLowStockVariants,
};
