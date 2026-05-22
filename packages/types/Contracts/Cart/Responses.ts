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
    quantity: number;
    cartId: string;
    productVariantId: string;
  };
};

export type UpdateCartItemQuantityResponse = {
  cartItem: {
    id: string;
    cartId: string;
    productVariantId: string;
    quantity: number;
  };
};

export type RemoveItemFromCartResponse = void;
