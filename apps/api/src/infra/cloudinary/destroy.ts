import { cloudinary } from "@/infra/cloudinary";

export async function destroyFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
