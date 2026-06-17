"use server";

import type { SearchProductsRequest, SearchProductsResponse } from "@repo/types/contracts";
import { cacheLife, cacheTag } from "next/cache";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function searchProducts(params?: SearchProductsRequest) {
  "use cache";
  cacheLife("seconds");
  cacheTag("products");

  const queryParams: Record<string, string | number> = {};

  if (params) {
    if (params.q) queryParams.q = params.q;
    if (params.categoryId) queryParams.categoryId = params.categoryId;
    if (params.onSale) queryParams.onSale = String(params.onSale);
    if (params.minRating !== undefined) queryParams.minRating = params.minRating;
    if (params.optionValues) queryParams.optionValues = params.optionValues;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.offset !== undefined) queryParams.offset = params.offset;
    if (params.limit !== undefined) queryParams.limit = params.limit;
  }

  const { data, error } = await fetchClient<SearchProductsResponse>("/products/search", {
    params: queryParams,
  });

  if (error) return { data: null, error };

  return { data, error: null };
}
