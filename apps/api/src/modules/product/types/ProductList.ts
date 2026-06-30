import type { findManyProducts } from "@/modules/product/repositories/findMany";
import type { ProductEnrichment } from "@/shared/utils/productLogic";

export type RawProductList = NonNullable<
  Awaited<ReturnType<typeof findManyProducts>>
>["rawProducts"];
export type RawProductListItem = RawProductList[0];
export type RawProductListVariant = RawProductListItem["productVariants"][0];

export type EnrichedProductListVariant = RawProductListVariant & { offer: ProductEnrichment };

export type EnrichedProductListItem = RawProductListItem & {
  heroVariant: EnrichedProductListVariant;
};

export type EnrichedProductList = EnrichedProductListItem[];
