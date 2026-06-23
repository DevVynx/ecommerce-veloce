"use server";

import type { ListAddressesResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function listAddresses() {
  const { data, error } = await fetchClient<ListAddressesResponse>("/users/addresses", {
    isPrivate: true,
  });

  if (error) return { data: null, error };

  return { data, error: null };
}
