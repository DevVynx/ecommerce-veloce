"use server";

import type { GetProductsRequest, GetProductsResponse } from "@repo/types/contracts";
import { cacheLife, cacheTag } from "next/cache";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function getProducts(params?: GetProductsRequest) {
  "use cache";
  cacheLife("seconds");
  cacheTag("products");

  const queryParams: Record<string, string | number> = {};

  if (params) {
    if (params.categoryId) queryParams.categoryId = params.categoryId;
    if (params.offset !== undefined) queryParams.offset = params.offset;
    if (params.limit !== undefined) queryParams.limit = params.limit;
    if (params.onSale) queryParams.onSale = String(params.onSale);
  }

  const { data, error } = await fetchClient<GetProductsResponse>(`/products`, {
    params: queryParams,
  });

  if (error) return { data: null, error };

  return { data, error: null };
}
