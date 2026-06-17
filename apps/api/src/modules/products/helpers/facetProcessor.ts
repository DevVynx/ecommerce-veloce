import type { SearchFiltersDto } from "@repo/types/contracts";

import type { SearchResult } from "@/infra/search";

type FacetData = Pick<SearchResult, "facetDistribution">;

type ProcessFacetsParams = {
  searchResult: FacetData;
  categoryNameMap: Map<string, string>;
  options: SearchFiltersDto["options"];
};

export const processFacets = ({
  searchResult,
  categoryNameMap,
  options,
}: ProcessFacetsParams): SearchFiltersDto => {
  const facetDistribution = searchResult.facetDistribution ?? {};

  const categoryDistribution = facetDistribution.categoryId ?? {};
  const categories = Object.entries(categoryDistribution).map(([id, count]) => ({
    id,
    name: categoryNameMap.get(id) ?? id,
    count,
  }));

  const onSaleDistribution = facetDistribution.onSale ?? {};
  const onSaleCount = onSaleDistribution["true"] ?? 0;

  const ratingMap = new Map<number, number>();

  for (const [value, count] of Object.entries(facetDistribution.ratingRate ?? {})) {
    const star = Math.floor(Number(value));
    ratingMap.set(star, (ratingMap.get(star) ?? 0) + (count as number));
  }

  const sortedStars = [...ratingMap.keys()].sort((a, b) => b - a);

  let acc = 0;
  const ratingOptions = sortedStars.map((star) => ({
    value: star,
    count: (acc += ratingMap.get(star)!),
  }));

  return {
    categories,
    ratingOptions,
    onSaleCount,
    options,
  };
};
