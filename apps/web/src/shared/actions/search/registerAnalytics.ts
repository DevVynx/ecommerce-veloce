"use server";

import type { RegisterAnalyticsRequest, RegisterAnalyticsResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function registerSearchAnalytics(params: RegisterAnalyticsRequest) {
  const { data, error } = await fetchClient<RegisterAnalyticsResponse>("/search/analytics", {
    method: "POST",
    body: params,
  });

  if (error) return { data: null, error };

  return { data, error: null };
}
