export type SearchParams = {
  query: string;
  filters?: string[];
  sort?: string[];
  limit?: number;
  offset?: number;
  facets?: string[];
};

export type SearchHit = Record<string, unknown>;

export type SearchResult = {
  hits: SearchHit[];
  totalHits: number;
  facetDistribution?: Record<string, Record<string, number>>;
  facetStats?: Record<string, { min: number; max: number }>;
};

export interface SearchEngine {
  search(index: string, params: SearchParams): Promise<SearchResult>;
}
