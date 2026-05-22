"use client";
import type { PublicProductDto, WishlistItemDto } from "@repo/types/contracts";
import { HeartIcon, ShoppingCartIcon, StarIcon } from "lucide-react";
import { useState } from "react";

import { addToWishlist } from "@/shared/actions/wishlist/addToWishlist";
import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { ProductDetailsDialog } from "@/shared/components/store/ProductDetailsModal/ProductDetailsDialog";
import { useWishlistState } from "@/shared/states/wishlist";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";
import { calculateDiscountPercent, formatPrice } from "@/shared/utils/store/price";

type ProductCardProps = {
  product: PublicProductDto;
  grid?: boolean;
};

export const ProductCard = ({ product, grid }: ProductCardProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { addItem, remove, rollback, hasHydrated, ids } = useWishlistState();

  const isWishlisted = hasHydrated && ids.includes(product.id);
  const percentDiscount = product.display.isOnSale
    ? calculateDiscountPercent(product.display.price, product.display.salePrice)
    : 0;

  const onCartClick = () => setIsDialogOpen(true);

  const handleToggleWishlist = async () => {
    if (isWishlisted) {
      remove(product.id);
      const { error } = await authenticatedAction(removeFromWishlist, { productId: product.id });
      if (error) {
        rollback();
      }
      return;
    }

    const wishlistItem: WishlistItemDto = {
      id: product.id,
      product: {
        id: product.id,
        title: product.title,
        ratingRate: product.ratingRate,
        ratingCount: product.ratingCount,
        display: { ...product.display },
      },
    };

    addItem(wishlistItem);
    const { error } = await authenticatedAction(addToWishlist, { productId: product.id });
    if (error) {
      rollback();
    }
  };

  return (
    <div
      className={`group cursor-pointer overflow-hidden rounded-2xl border border-black/20 bg-white shadow-sm transition hover:scale-105 ${
        grid ? "w-full" : "w-60 shrink-0"
      }`}
    >
      {/* Image + Percent + Wish Button */}
      <div className="relative bg-black/10 p-4">
        {/* Image */}
        <img
          src={product.display.image}
          alt={product.title}
          className="aspect-square w-full object-contain"
        />

        {/* Percent */}
        {product.display.isOnSale && (
          <strong className="absolute top-2 left-2 my-1 inline-block rounded-4xl bg-red-500 px-2 py-1 text-sm font-bold text-white">
            - {percentDiscount}% off
          </strong>
        )}

        {/* Wish Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1 shadow-md transition duration-150 hover:scale-110 active:scale-140`}
          aria-label="Add to favorites"
        >
          <HeartIcon
            className={`size-4 lg:size-5 ${
              isWishlisted ? "fill-red-500 text-red-500" : "fill-gray-400 text-gray-400"
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="relative p-2">
        <h1 className="mb-1 line-clamp-2 h-8.75 text-sm leading-tight font-semibold">
          {product.title}
        </h1>

        {/* Rating */}
        <div className="mb-1 flex items-center text-xs text-gray-500">
          <StarIcon className="mr-1 h-3 w-3 fill-yellow-400 stroke-yellow-400" />
          <span className="font-bold text-black">{product.ratingRate.toFixed(1) ?? "–"}</span>
          <span className="mx-1">·</span>
          <span>+{product.ratingCount ? `${product.ratingCount} vendidos` : "Novo"}</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1">
          <strong className="font-semibold">{formatPrice(product.display.salePrice)}</strong>
          {product.display.isOnSale && (
            <span className="text-sm text-red-500 line-through">
              {formatPrice(product.display.price)}
            </span>
          )}
        </div>

        {/* Cart Button */}
        <button
          onClick={onCartClick}
          className={`absolute right-2 bottom-2 hidden cursor-pointer rounded-full bg-white p-1 shadow-md transition duration-150 hover:scale-110 active:scale-140 lg:right-3 lg:bottom-3 lg:hidden lg:group-hover:block`}
          aria-label="Add to cart"
        >
          <ShoppingCartIcon
            className={"fill-blackfill-gray-500 block size-4 text-black lg:size-5"}
          />
        </button>
      </div>

      <ProductDetailsDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} product={product} />
    </div>
  );
};
