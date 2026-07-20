export type ProductValueDto = {
  id: string;
  value: string;
};

export type ProductOptionDto = {
  id: string;
  name: string;
  values: ProductValueDto[];
};

export type VariantDto = {
  id: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  isOnSale: boolean;
  isAvailable: boolean;
  optionValueIds: string[];
};

export type CatalogProductDto = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ratingRate: number;
  ratingCount: number;
  display: {
    image: string;
    price: number;
    salePrice: number;
    isOnSale: boolean;
    variantId: string;
    isAvailable: boolean;
  };
};

export type DetailedProductDto = {
  id: string;
  slug: string;
  title: string;
  description: string;
  ratingRate: number;
  ratingCount: number;
  ratingDistribution: Record<number, number>;
  display: {
    image: string;
    price: number;
    salePrice: number;
    isOnSale: boolean;
    variantId: string;
    isAvailable: boolean;
  };
  category: {
    id: string;
    name: string;
  };
};

export type SearchFiltersDto = {
  categories: { id: string; name: string }[];
  ratingOptions: { value: number }[];
  options: {
    id: string;
    name: string;
    values: { value: string }[];
  }[];
};

export type GetProductsResponse = {
  products: CatalogProductDto[];
  pagination: { total: number; hasMore: boolean };
};

export type GetProductDetailsResponse = {
  product: DetailedProductDto;
  options: ProductOptionDto[];
  variants: VariantDto[];
};

export type AdminCountLowStockVariantsResponse = {
  lowStockCount: number;
};

export type AdminProductVariantDto = {
  id: string;
  sku: string;
  price: number;
  salePrice: number;
  stock: number;
  isActive: boolean;
  options: { name: string; value: string }[];
};

export type AdminProductListItem = {
  id: string;
  title: string;
  image: string;
  category: { id: string; name: string };
  totalStock: number;
  activeCount: number;
  inactiveCount: number;
  minPrice: number;
  maxPrice: number;
  variants: AdminProductVariantDto[];
};

export type AdminSearchProductsResponse = {
  products: AdminProductListItem[];
  pagination: { total: number; page: number; totalPages: number };
};

export type SearchProductsResponse = {
  products: CatalogProductDto[];
  filters: SearchFiltersDto;
  pagination: { total: number; hasMore: boolean };
};

export type CategoryDto = {
  id: string;
  name: string;
};

export type GetCategoriesResponse = {
  categories: CategoryDto[];
};

export type UploadVariantImageResponse = {
  url: string;
  publicId: string;
};

export type CreateProductResponse = {
  id: string;
  name: string;
  variantsCount: number;
};

export type DeleteVariantImageResponse = {
  message: string;
};
