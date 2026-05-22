export type AddItemToCartRequest = {
  productVariantId: string;
  quantity: number;
};

export type UpdateCartItemQuantityRequest = {
  cartItemId: string;
  quantity: number;
};

export type RemoveItemFromCartRequest = {
  cartItemId: string;
};
