export type GetProductsRequest = {
  categoryId?: string;
  offset?: number;
  limit?: number;
  onSale?: boolean;
};

export type GetProductDetailsRequest = {
  productId: string;
};

export type GetProductBySlugRequest = {
  slug: string;
};

export type AdminSearchProductsRequest = {
  q?: string;
  categoryId?: string;
  isActive?: boolean;
  stockLt?: number;
  sortBy?: "price_asc" | "price_desc" | "stock_asc" | "stock_desc" | "newest" | "oldest";
  page?: number;
  limit?: number;
};

export type SearchProductsRequest = {
  q?: string;
  categoryId?: string;
  onSale?: boolean;
  minRating?: number;
  optionValues?: string;
  sortBy?: "price_asc" | "price_desc" | "rating_desc" | "newest";
  offset?: number;
  limit?: number;
};