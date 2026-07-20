"use server";

import { fetchClient } from "@/shared/utils/api/fetchClient";
import { withAuthRefresh } from "@/shared/utils/api/withAuthRefresh";

export async function deleteImageFile(publicId: string) {
  const { error } = await withAuthRefresh(() =>
    fetchClient(`/admin/products/images/${encodeURIComponent(publicId)}`, {
      isPrivate: true,
      method: "DELETE",
    })
  );

  if (error) return { error };

  return { error: null };
}
