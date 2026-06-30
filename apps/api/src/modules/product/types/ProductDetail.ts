import type { findProductById } from "@/modules/product/repositories/findById";
import type { ProductEnrichment } from "@/shared/utils/productLogic";

export type RawProductDetail = NonNullable<Awaited<ReturnType<typeof findProductById>>>;
export type RawProductDetailVariant = RawProductDetail["productVariants"][0];

export type EnrichedProductDetailVariant = RawProductDetailVariant & { offer: ProductEnrichment };

export type EnrichedProductDetail = Omit<RawProductDetail, "productVariants" | "heroVariant"> & {
  productVariants: EnrichedProductDetailVariant[];
  heroVariant: EnrichedProductDetailVariant;
};
