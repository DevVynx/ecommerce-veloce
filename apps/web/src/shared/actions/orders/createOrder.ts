"use server";

import type { CreateOrderRequest, CreateOrderResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function createOrder(params: CreateOrderRequest) {
  const { data, error } = await fetchClient<CreateOrderResponse>("/orders", {
    isPrivate: true,
    method: "POST",
    body: params,
  });

  if (error) return { data: null, error };
  return { data, error: null };
}
