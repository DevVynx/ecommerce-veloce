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

export type GetProductsResponse = {
  products: CatalogProductDto[];
};

export type GetProductDetailsResponse = {
  product: DetailedProductDto;
  options: ProductOptionDto[];
  variants: VariantDto[];
};
