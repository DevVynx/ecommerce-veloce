"use server";

import type { AddressInput, UpdateAddressResponse } from "@repo/types/contracts";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function updateAddress(addressId: string, input: Partial<AddressInput>) {
  const { data, error } = await fetchClient<UpdateAddressResponse>(
    `/users/addresses/${addressId}`,
    {
      isPrivate: true,
      method: "PUT",
      body: input,
    }
  );

  if (error) return { data: null, error };

  return { data, error: null };
}
