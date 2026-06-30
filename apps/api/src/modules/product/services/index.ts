import { findProductById } from "@/modules/product/services/findById";
import { findProductBySlug } from "@/modules/product/services/findBySlug";
import { findManyProducts } from "@/modules/product/services/findMany";
import { findVariantById } from "@/modules/product/services/findVariantById";
import { findVariantByIdWithProduct } from "@/modules/product/services/findVariantByIdWithProduct";
import { searchProducts } from "@/modules/product/services/searchProducts";

export const productServices = {
  findMany: findManyProducts,
  findById: findProductById,
  findBySlug: findProductBySlug,
  findVariantById: findVariantById,
  findVariantByIdWithProduct: findVariantByIdWithProduct,
  search: searchProducts,
};
