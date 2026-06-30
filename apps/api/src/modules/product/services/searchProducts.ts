import { searchEngine } from "@/infra/search";
import { productLogic } from "@/shared/utils/productLogic";

import { processFacets } from "../helpers/facetProcessor";
import { buildSearchFilters } from "../helpers/filterBuilder";
import { productRepositories } from "../repositories";
import type { EnrichedProductList, EnrichedProductListItem } from "../types/ProductList";
import type { SearchProductsParams } from "../types/ServiceParams";

const SORT_MAP: Record<string, string> = {
  price_asc: "salePrice:asc",
  price_desc: "salePrice:desc",
  rating_desc: "ratingRate:desc",
  newest: "createdAt:desc",
};

export const searchProducts = async ({
  q,
  categoryId,
  onSale,
  minRating,
  optionValues,
  sortBy,
  offset,
  limit,
}: SearchProductsParams) => {
  const filters = buildSearchFilters({ categoryId, onSale, minRating });

  if (optionValues) {
    const { productIds } = await productRepositories.findProductIdsByOptionValues(
      optionValues.split(",")
    );

    if (productIds.length === 0) {
      return {
        enrichedProducts: [] as EnrichedProductList,
        pagination: { total: 0, hasMore: false },
        filters: {
          categories: [],
          ratingOptions: [],
          onSaleCount: 0,
          options: [],
        },
      };
    }

    filters.push(`id IN [${productIds.map((id) => `"${id}"`).join(", ")}]`);
  }

  const searchResult = await searchEngine.search("products", {
    query: q ?? "",
    filters: filters.length > 0 ? filters : undefined,
    sort: sortBy ? [SORT_MAP[sortBy]!] : undefined,
    limit,
    offset,
    facets: ["categoryId", "categoryName", "onSale", "ratingRate", "optionValues"],
  });

  const totalHits = searchResult.totalHits;
  const ids = searchResult.hits.map((hit) => String(hit.id));

  const categoryIds = Object.keys(searchResult.facetDistribution?.categoryId ?? {});
  const categoryNameMap =
    categoryIds.length > 0
      ? await productRepositories.findCategoryNamesByIds(categoryIds)
      : new Map<string, string>();

  const emptyPagination = { total: totalHits, hasMore: false };

  if (ids.length === 0) {
    return {
      enrichedProducts: [] as EnrichedProductList,
      pagination: emptyPagination,
      filters: processFacets({
        searchResult,
        categoryNameMap,
        options: [],
      }),
    };
  }

  const rawProducts = await productRepositories.findByIds(ids);

  const productMap = new Map(rawProducts.map((p) => [p.id, p]));
  const enrichedProducts: EnrichedProductListItem[] = [];

  for (const id of ids) {
    const product = productMap.get(id);
    if (!product) continue;

    const variantsWithEnrichment = product.productVariants.map((variant) => {
      const offer = productLogic.calculateEnrichment(variant, {
        variant: variant.promotions,
        product: product.promotions,
        category: product.category.promotions,
      });
      return { ...variant, offer };
    });

    const heroVariant = productLogic.pickHeroVariant(variantsWithEnrichment);
    if (!heroVariant) continue;

    enrichedProducts.push({
      ...product,
      productVariants: variantsWithEnrichment,
      heroVariant,
    } as EnrichedProductListItem);
  }

  const optionValuesFacets = (searchResult.facetDistribution?.optionValues ?? {}) as Record<
    string,
    number
  >;
  const optionMap = new Map<
    string,
    { id: string; name: string; values: { value: string; count: number }[] }
  >();

  for (const [key, count] of Object.entries(optionValuesFacets)) {
    const separatorIndex = key.indexOf("::");
    if (separatorIndex === -1) continue;

    const name = key.slice(0, separatorIndex);
    const value = key.slice(separatorIndex + 2);

    if (!optionMap.has(name)) {
      optionMap.set(name, { id: name, name, values: [] });
    }

    const entry = optionMap.get(name)!;
    entry.values.push({ value, count });
  }

  const options = [...optionMap.values()];

  return {
    enrichedProducts,
    filters: processFacets({
      searchResult,
      categoryNameMap,
      options,
    }),
    pagination: {
      total: totalHits,
      hasMore: offset + limit < totalHits,
    },
  };
};
