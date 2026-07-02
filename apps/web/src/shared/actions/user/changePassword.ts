"use server";

import { fetchClient } from "@/shared/utils/api/fetchClient";

export async function changePassword(input: { currentPassword: string; newPassword: string }) {
  const { data, error } = await fetchClient<void>("/users/password", {
    isPrivate: true,
    method: "PUT",
    body: input,
  });

  if (error) return { data: null, error };

  return { data, error: null };
}
