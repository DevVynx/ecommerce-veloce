import type { AdminSearchProductsRequest } from "@repo/types/contracts";

import { searchEngine } from "@/infra/search";
import { productRepositories } from "@/modules/product/repositories";

const SORT_MAP: Record<string, string> = {
  price_asc: "minPrice:asc",
  price_desc: "minPrice:desc",
  stock_asc: "totalStock:asc",
  stock_desc: "totalStock:desc",
  newest: "createdAt:desc",
  oldest: "createdAt:asc",
};

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
    const variants = product.productVariants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: Number(variant.price),
      salePrice: Number(variant.price),
      stock: variant.stock,
      isActive: variant.isActive,
      options: variant.productVariantOptions.map((pvo) => ({
        name: pvo.productOptionValue.productOption.name,
        value: pvo.productOptionValue.value,
      })),
    }));

    const activeVariants = variants.filter((v) => v.isActive);
    const activeCount = activeVariants.length;
    const inactiveCount = variants.length - activeCount;

    const prices = activeVariants.map((v) => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      id: product.id,
      title: product.title,
      image: product.image,
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

  if (stockLt !== undefined) {
    return searchWithDb({ q, categoryId, isActive, stockLt, sortBy, page, limit });
  }

  const offset = (page - 1) * limit;

  const filters: string[] = [];

  if (categoryId) filters.push(`categoryId = "${categoryId}"`);
  if (isActive !== undefined) filters.push(`isActive = ${isActive}`);

  const searchResult = await searchEngine.search("admin_products", {
    query: q ?? "",
    filters: filters.length > 0 ? filters : undefined,
    sort: sortBy ? [SORT_MAP[sortBy]!] : undefined,
    limit,
    offset,
  });

  const totalHits = searchResult.totalHits;
  const ids = searchResult.hits.map((hit) => String(hit.id));

  if (ids.length === 0) {
    return {
      products: [],
      pagination: {
        total: totalHits,
        page,
        totalPages: Math.ceil(totalHits / limit),
      },
    };
  }

  const rawProducts = await productRepositories.findProductsAdmin(ids);

  const products = rawProducts.map((product) => {
    const variants = product.productVariants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      price: Number(variant.price),
      salePrice: Number(variant.price),
      stock: variant.stock,
      isActive: variant.isActive,
      options: variant.productVariantOptions.map((pvo) => ({
        name: pvo.productOptionValue.productOption.name,
        value: pvo.productOptionValue.value,
      })),
    }));

    const activeVariants = variants.filter((v) => v.isActive);
    const activeCount = activeVariants.length;
    const inactiveCount = variants.length - activeCount;

    const prices = activeVariants.map((v) => v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return {
      id: product.id,
      title: product.title,
      image: product.image,
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
      total: totalHits,
      page,
      totalPages: Math.ceil(totalHits / limit),
    },
  };
};
