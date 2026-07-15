"use server";

import type { SearchSuggestionsResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function getSearchSuggestions(q?: string, limit = 10) {
  const params: Record<string, string | number> = { limit };

  if (q) params.q = q;

  const { data, error } = await fetchClient<SearchSuggestionsResponse>("/search/suggestions", {
    params,
  });

  if (error) return { data: null, error };

  return { data, error: null };
}
