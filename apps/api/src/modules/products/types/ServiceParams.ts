import type { SearchProductsRequest } from "@repo/types/contracts";
import { GetProductsRequest } from "@repo/types/contracts";

export type FindAllProductsParams = GetProductsRequest & {
  onlyAvailable?: boolean;
  limit: number;
  offset: number;
};

export type SearchProductsParams = Required<Pick<SearchProductsRequest, "offset" | "limit">> &
  Pick<
    SearchProductsRequest,
    "q" | "categoryId" | "onSale" | "minRating" | "optionValues" | "sortBy"
  >;

export type FindProductByIdParams = {
  productId: string;
};

export type FindProductBySlugParams = {
  slug: string;
};

export type FindVariantByIdParams = {
  variantId: string;
};

export type findVariantByIdWithProductParams = {
  variantId: string;
};
