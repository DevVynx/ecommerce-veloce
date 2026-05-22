export type WishlistItemDto = {
  id: string;
  product: {
    id: string;
    title: string;
    ratingRate: number;
    ratingCount: number;
    display: {
      variantId: string;
      image: string;
      price: number;
      salePrice: number;
      isOnSale: boolean;
      isAvailable: boolean;
    };
  };
};

export type WishlistDto = {
  id: string;
  items: WishlistItemDto[];
  count: number;
};

export type GetUserWishlistResponse = {
  wishlist: WishlistDto | null;
};

export type AddItemToWishlistResponse = {
  wishlistItem: {
    id: string;
    wishlistId: string;
    productId: string;
  };
};

export type RemoveWishlistItemResponse = void;
