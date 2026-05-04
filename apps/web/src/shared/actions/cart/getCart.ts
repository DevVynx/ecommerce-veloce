"use server";

import type { GetCartResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function getCart() {
  const { data, error } = await fetchClient<GetCartResponse>("/cart", {
    isPrivate: true,
  });

  if (error) return { data: null, error };
  
  return { data, error: null };
}
