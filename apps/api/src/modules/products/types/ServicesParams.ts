import { GetProductsRequest } from "@repo/types/contracts";

export type FindAllProductsParams = GetProductsRequest & {
  onlyAvailable?: boolean;
};

export type FindProductByIdParams = {
  productId: string;
};
