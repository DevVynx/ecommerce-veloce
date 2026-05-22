export type GetProductsRequest = {
  categoryId?: string;
  offset?: number;
  limit?: number;
  onSale?: boolean;
};

export type GetProductDetailsRequest = {
  productId: string;
};
