"use server";

import type { GetCategoriesResponse } from "@repo/types/contracts";
import { cacheLife, cacheTag } from "next/cache";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function getCategories() {
  "use cache";
  cacheLife("seconds");
  cacheTag("categories");

  const { data, error } = await fetchClient<GetCategoriesResponse>(`/categories`);

  if (error) return { data: null, error };

  return { data, error: null };
}
