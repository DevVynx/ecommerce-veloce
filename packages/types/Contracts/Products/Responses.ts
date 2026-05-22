export type ProductValueDto = {
  id: string;
  value: string;
};

export type ProductOptionDto = {
  id: string;
  name: string;
  values: ProductValueDto[];
};

export type PublicVariantDto = {
  id: string;
  sku: string;
  price: number;
  salePrice: number;
  isOnSale: boolean;
  isAvailable: boolean;
  optionValueIds: string[];
};

export type PublicProductDto = {
  id: string;
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

export type GetProductsResponse = {
  products: PublicProductDto[];
};

export type GetProductDetailsResponse = {
  product: PublicProductDto;
  options: ProductOptionDto[];
  variants: PublicVariantDto[];
};
