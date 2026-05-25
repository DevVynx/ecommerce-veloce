export type CartItemDto = {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    variant: {
      id: string;
      image: string;
      price: number;
      stock: number;
      salePrice: number;
      isOnSale: boolean;
      isAvailable: boolean;
    };
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

export type CartDto = {
  id: string;
  items: CartItemDto[];
  summary: {
    count: number;
    subtotal: number;
    total: number;
    discount: number;
  };
};

export type SyncCartSucceedItemDto = {
  productVariantId: string;
  productTitle: string;
  cartItemId: string;
};

export type SyncCartFailedItemDto = {
  productVariantId: string;
  productTitle: string;
  reason: string;
};

export type GetCartResponse = {
  cart: CartDto | null;
};

export type GetCartItemsResponse = {
  items: CartItemDto[] | null;
  count: number;
};

export type AddItemToCartResponse = {
  cartItem: {
    id: string;
    cartId: string;
    quantity: number;
    productVariantId: string;
    stock: number;
  };
};

export type SyncCartResponse = {
  cart: CartDto | null;
  results: {
    succeeded: SyncCartSucceedItemDto[];
    failed: SyncCartFailedItemDto[];
  };
};

export type UpdateCartItemQuantityResponse = {
  cartItem: {
    id: string;
    cartId: string;
    quantity: number;
    productVariantId: string;
    stock: number;
  };
};

export type RemoveItemFromCartResponse = void;
