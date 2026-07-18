import { uploadToCloudinary } from "@/infra/cloudinary/upload";

interface UploadVariantImageResponse {
  url: string;
  publicId: string;
}

export async function uploadVariantImage(buffer: Buffer): Promise<UploadVariantImageResponse> {
  const { url, publicId } = await uploadToCloudinary(buffer, "belibeli/products");

  return { url, publicId };
}
