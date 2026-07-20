import { countLowStockVariants } from "@/modules/product/services/countLowStockVariants";
import { createProduct } from "@/modules/product/services/createProduct";
import { deleteVariantImage } from "@/modules/product/services/deleteVariantImage";
import { findProductById } from "@/modules/product/services/findById";
import { findProductBySlug } from "@/modules/product/services/findBySlug";
import { findManyProducts } from "@/modules/product/services/findMany";
import { findVariantById } from "@/modules/product/services/findVariantById";
import { findVariantByIdWithProduct } from "@/modules/product/services/findVariantByIdWithProduct";
import { getCategories } from "@/modules/product/services/getCategories";
import { searchAdminProducts } from "@/modules/product/services/searchAdminProducts";
import { searchProducts } from "@/modules/product/services/searchProducts";
import { updateRatingAggregates } from "@/modules/product/services/updateRatingAggregates";
import { uploadVariantImage } from "@/modules/product/services/uploadVariantImage";

export const productServices = {
  countLowStockVariants,
  createProduct,
  deleteVariantImage,
  getCategories,
  findMany: findManyProducts,
  findById: findProductById,
  findBySlug: findProductBySlug,
  findVariantById: findVariantById,
  findVariantByIdWithProduct: findVariantByIdWithProduct,
  search: searchProducts,
  searchAdminProducts,
  updateRatingAggregates,
  uploadVariantImage,
};
