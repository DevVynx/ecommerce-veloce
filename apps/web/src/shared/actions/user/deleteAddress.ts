"use server";

import type { DeleteAddressResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function deleteAddress(addressId: string) {
  const { error } = await fetchClient<DeleteAddressResponse>(`/users/addresses/${addressId}`, {
    isPrivate: true,
    method: "DELETE",
  });

  if (error) return { data: null, error };

  return { data: null, error: null };
}
