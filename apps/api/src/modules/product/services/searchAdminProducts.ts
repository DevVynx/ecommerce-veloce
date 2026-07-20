import type { AdminSearchProductsRequest } from "@repo/types/contracts";

import { productRepositories } from "@/modules/product/repositories";
import { productLogic } from "@/shared/utils/productLogic";

async function searchWithDb(
  params: Required<Pick<AdminSearchProductsRequest, "page" | "limit">> &
    Omit<AdminSearchProductsRequest, "page" | "limit">
) {
  const { q, categoryId, stockLt, isActive, sortBy, page, limit } = params;

  const { products: rawProducts, total } = await productRepositories.findAdminProductsByFilters({
    q,
    categoryId,
    stockLt,
    isActive,
    sortBy,
    page,
    limit,
  });

  const products = rawProducts.map((product) => {
    const variants = product.productVariants.map((variant) => {
      const offer = productLogic.calculateEnrichment(variant, {
        variant: variant.promotions,
        product: product.promotions,
        category: product.category.promotions,
      });

      return {
        id: variant.id,
        sku: variant.sku,
        price: Number(variant.price),
        salePrice: Number(offer.salePrice),
        stock: variant.stock,
        isActive: variant.isActive,
        options: variant.optionValues.map((pvo) => ({
          name: pvo.productOptionValue.productOption.name,
          value: pvo.productOptionValue.value,
        })),
        images: variant.images.map((img) => ({ url: img.url })),
      };
    });

    const activeVariants = variants.filter((v) => v.isActive);
    const activeCount = activeVariants.length;
    const inactiveCount = variants.length - activeCount;

    const salePrices = activeVariants.map((v) => v.salePrice);
    const minPrice = salePrices.length > 0 ? Math.min(...salePrices) : 0;
    const maxPrice = salePrices.length > 0 ? Math.max(...salePrices) : 0;

    return {
      id: product.id,
      title: product.title,
      image: product.productVariants[0]?.images[0]?.url ?? "",
      category: product.category,
      totalStock: product.totalStock,
      activeCount,
      inactiveCount,
      minPrice,
      maxPrice,
      variants,
    };
  });

  return {
    products,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export const searchAdminProducts = async (params: AdminSearchProductsRequest) => {
  const { q, categoryId, isActive, stockLt, sortBy, page = 1, limit = 20 } = params;

  return searchWithDb({ q, categoryId, isActive, stockLt, sortBy, page, limit });
};
