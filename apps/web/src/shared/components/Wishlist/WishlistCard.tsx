import type { WishlistItemDto } from "@repo/types/contracts";
import { HeartIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import { calculateDiscountPercent, formatPrice } from "@/shared/utils/store/price";

type WishlistCardProps = {
  item: WishlistItemDto;
  onRemove: (productId: string) => void;
};

export const WishlistCard = ({ item, onRemove }: WishlistCardProps) => {
  const { product } = item;
  const { display } = product;

  const percentDiscount = display.isOnSale
    ? calculateDiscountPercent(display.price, display.salePrice)
    : 0;

  return (
    <div className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:scale-[1.02]">
      <div className="relative bg-black/10 p-4">
        <Link href={`/product/${product.slug}`}>
          <img
            src={display.image}
            alt={product.title}
            className="aspect-square w-full cursor-pointer object-contain"
          />
        </Link>

        {display.isOnSale && (
          <strong className="absolute top-2 left-2 inline-block rounded-4xl bg-red-500 px-2 py-1 text-sm font-bold text-white">
            - {percentDiscount}% off
          </strong>
        )}

        <button
          onClick={() => onRemove(product.id)}
          className="absolute top-2 right-2 cursor-pointer rounded-full bg-white p-1.5 shadow-md transition duration-150 hover:scale-110 active:scale-140"
          aria-label="Remover dos favoritos"
        >
          <HeartIcon className="size-4 fill-red-500 text-red-500 lg:size-5" />
        </button>
      </div>

      <Link href={`/product/${product.slug}`}>
        <div className="space-y-1.5 p-3">
          <h3 className="line-clamp-1 cursor-pointer text-sm leading-tight font-semibold">
            {product.title}
          </h3>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <StarIcon className="size-3 fill-yellow-400 stroke-yellow-400" />
            <span className="font-bold text-black">{product.ratingRate.toFixed(1)}</span>
            <span>·</span>
            <span>+{product.ratingCount ? `${product.ratingCount} vendidos` : "Novo"}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <strong className="text-sm font-bold">{formatPrice(display.salePrice)}</strong>
            {display.isOnSale && (
              <span className="text-xs text-red-500 line-through">
                {formatPrice(display.price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};
