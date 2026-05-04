"use server";

import type { AddItemToCartRequest, AddItemToCartResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function addItemToCart(params: AddItemToCartRequest) {
  const { data, error } = await fetchClient<AddItemToCartResponse>("/cart/items", {
    isPrivate: true,
    method: "POST",
    body: params,
  });

  if (error) return { data: null, error };
  
  return { data, error: null };
}
