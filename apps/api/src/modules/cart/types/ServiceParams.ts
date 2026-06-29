import {
  AddItemToCartRequest,
  RemoveItemFromCartRequest,
  SyncCartRequest,
  UpdateCartItemQuantityRequest,
} from "@repo/types/contracts";

export type FindCartByIdParams = {
  userId: string;
};

export type GetCartItemsParams = {
  userId: string;
};

export type CreateCartItemParams = {
  userId: string;
} & AddItemToCartRequest;

export type SyncCartParams = {
  userId: string;
} & SyncCartRequest;

export type UpdateCartItemQuantityParams = {
  userId: string;
} & UpdateCartItemQuantityRequest;

export type RemoveItemFromCartParams = {
  userId: string;
} & RemoveItemFromCartRequest;

export type ClearCartParams = {
  userId: string;
};
