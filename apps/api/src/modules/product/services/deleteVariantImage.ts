import { destroyFromCloudinary } from "@/infra/cloudinary/destroy";

export async function deleteVariantImage(publicId: string): Promise<void> {
  await destroyFromCloudinary(publicId);
}
