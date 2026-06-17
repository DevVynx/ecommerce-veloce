import { Meilisearch } from "meilisearch";

import type { SearchEngine, SearchParams, SearchResult } from "./types";

export class MeilisearchAdapter implements SearchEngine {
  private client: Meilisearch;

  constructor(config: { host: string; apiKey: string }) {
    this.client = new Meilisearch(config);
  }

  async search(index: string, params: SearchParams): Promise<SearchResult> {
    const filters = params.filters?.length ? params.filters.join(" AND ") : undefined;

    const response = await this.client.index(index).search(params.query, {
      filter: filters,
      sort: params.sort,
      limit: params.limit,
      offset: params.offset,
      facets: params.facets,
    });

    return {
      hits: response.hits as SearchResult["hits"],
      totalHits: response.estimatedTotalHits ?? 0,
      facetDistribution: response.facetDistribution,
      facetStats: response.facetStats,
    };
  }
}
