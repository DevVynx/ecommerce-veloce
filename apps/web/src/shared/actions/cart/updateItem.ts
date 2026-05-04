"use server";

import type {
  UpdateCartItemQuantityRequest,
  UpdateCartItemQuantityResponse,
} from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function updateCartItemQuantity(params: UpdateCartItemQuantityRequest) {
  const { data, error } = await fetchClient<UpdateCartItemQuantityResponse>(
    `/cart/items/${params.cartItemId}/quantity`,
    {
      isPrivate: true,
      method: "PATCH",
      body: params,
    }
  );

  if (error) return { data: null, error };
  
  return { data, error: null };
}
