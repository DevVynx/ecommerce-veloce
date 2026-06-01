import type {
  ProductOptionDto,
  PublicProductDto,
  PublicVariantDto,
  WishlistItemDto,
} from "@repo/types/contracts";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { addToWishlist } from "@/shared/actions/wishlist/addToWishlist";
import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { Rating, RatingItem } from "@/shared/components/shadcn-ui/rating";
import { showNotification } from "@/shared/components/showNotification";
import { useCartMutations } from "@/shared/hooks/data/useCartMutations";
import { useProductVariantSelection } from "@/shared/hooks/data/useProductVariantSelection";
import { useWishlistState } from "@/shared/states/wishlist";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";
import { buildSelectedOptionsForCart } from "@/shared/utils/store/buildSelectedOptions";
import { calculateDiscountPercent, formatPrice } from "@/shared/utils/store/price";

import { ProductOptions } from "./ProductOptions";
import { QuantitySelector } from "./QuantitySelector";
import { StockBadge } from "./StockBadge";

type ProductDetailsProps = {
  onClose: () => void;
  selectedProduct: PublicProductDto;
  variants: PublicVariantDto[];
  options: ProductOptionDto[];
};

export const ProductDetails = ({
  selectedProduct,
  onClose,
  variants,
  options,
}: ProductDetailsProps) => {
  const { addItemToCart, isLoading: isAddingToCart } = useCartMutations();
  const displayVariantStock =
    variants.find((v) => v.id === selectedProduct.display.variantId)?.stock ?? 0;
  const { selectedOptions, setSelectedOptions, selectedVariant } = useProductVariantSelection(
    variants,
    options,
    {
      variantId: selectedProduct.display.variantId,
      price: selectedProduct.display.price,
      salePrice: selectedProduct.display.salePrice,
      stock: displayVariantStock,
      isOnSale: selectedProduct.display.isOnSale,
      isAvailable: selectedProduct.display.isAvailable,
    }
  );
  const {
    addItem: optimisticAddToWishlist,
    remove: optimisticRemoveFromWishlist,
    rollback: optimisticRollbackWishlist,
    hasHydrated: hasHydratedWishlist,
    ids: wishlistIds,
  } = useWishlistState();

  const [stockFeedback, setStockFeedback] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { id, title, ratingRate, ratingCount } = selectedProduct;
  const isOutOfStock = !!selectedVariant && !selectedVariant.isAvailable;
  const isWishlisted = hasHydratedWishlist && wishlistIds.includes(id);

  useEffect(() => {
    setQuantity(1);
    setStockFeedback(null);
  }, [selectedProduct.id, selectedOptions, variants, options]);

  const displayPrice = selectedVariant?.price ?? selectedProduct.display.price;
  const displaySalePrice = selectedVariant?.salePrice ?? selectedProduct.display.salePrice;
  const displayIsOnSale = selectedVariant?.isOnSale ?? selectedProduct.display.isOnSale;

  const handleAddToCart = async () => {
    if (isAddingToCart || !selectedVariant) return;

    const result = await addItemToCart({
      productVariantId: selectedVariant.id,
      quantity,
      stock: selectedVariant.stock,
      productId: selectedProduct.id,
      productSlug: selectedProduct.slug,
      productTitle: selectedProduct.title,
      variantId: selectedVariant.id,
      image: selectedProduct.display.image,
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      isOnSale: displayIsOnSale,
      isAvailable: selectedVariant.isAvailable,
      selectedOptions: buildSelectedOptionsForCart(options, selectedOptions),
    });

    if (result?.error) {
      const message =
        typeof result.error.message === "string"
          ? result.error.message
          : "Erro ao adicionar ao carrinho.";
      setStockFeedback(message);
      return;
    }

    showNotification({
      type: "success",
      title: "Adicionado ao carrinho",
      message: "O seu item foi adicionado ao carrinho.",
    });

    onClose();
  };

  const handleToggleWishlist = async () => {
    if (isWishlisted) {
      optimisticRemoveFromWishlist(id);
      const { error } = await authenticatedAction(removeFromWishlist, { productId: id });
      if (error) optimisticRollbackWishlist();
    } else {
      const wishlistItem: WishlistItemDto = {
        id,
        product: {
          id,
          slug: selectedProduct.slug,
          title: selectedProduct.title,
          ratingRate: selectedProduct.ratingRate,
          ratingCount: selectedProduct.ratingCount,
          display: { ...selectedProduct.display },
        },
      };

      optimisticAddToWishlist(wishlistItem);
      const { error } = await authenticatedAction(addToWishlist, { productId: id });
      if (error) optimisticRollbackWishlist();
    }

    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > (selectedVariant?.stock ?? 99)) return;
    setQuantity(newQuantity);
  };

  const handleSelectOption = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: valueId }));
  };

  const percentDiscount = displayIsOnSale
    ? calculateDiscountPercent(displayPrice, displaySalePrice)
    : 0;

  return (
    <div className="flex h-125 gap-10">
      {/* Imagem - lado esquerdo */}
      <div className="relative flex-1 overflow-hidden">
        <div className="flex h-full items-center justify-center bg-black/10 p-4">
          {displayIsOnSale && (
            <span className="absolute top-2 right-2 rounded-sm bg-red-500 px-2 py-1 font-bold text-white shadow-sm">
              -{percentDiscount}%
            </span>
          )}
          <img
            src={selectedProduct.display.image}
            alt={title}
            className="max-h-full w-full object-contain"
          />
        </div>
      </div>

      {/* Detalhes - lado direito */}
      <div className="flex h-full flex-1 flex-col">
        {/* ========== SEÇÃO SUPERIOR ========== */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold">{title}</h1>

          {/* Rating */}
          <div className="my-3 flex items-center gap-2 text-yellow-500">
            <Rating value={ratingRate} readOnly size="sm" step={0.5} className="text-yellow-500">
              {Array.from({ length: 5 }, (_, i) => (
                <RatingItem key={i}>
                  <Star />
                </RatingItem>
              ))}
            </Rating>
            <span className="text-sm text-zinc-400">({ratingCount} Avaliações)</span>
          </div>

          {/* Price + Stock */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-zinc-300 pb-3">
            <strong className="text-2xl font-semibold text-gray-800">
              {formatPrice(displaySalePrice)}
            </strong>
            {displayIsOnSale && (
              <span className="text-sm text-red-500 line-through">{formatPrice(displayPrice)}</span>
            )}
            {selectedVariant && <StockBadge isAvailable={selectedVariant.isAvailable} />}
          </div>
        </div>

        {/* ========== SEÇÃO DO MEIO (scroll) ========== */}
        <div className="min-h-0 flex-1 overflow-y-auto py-2 pr-2 pl-2">
          {/* Product Options */}
          {options.length > 0 && (
            <div className="mb-6">
              <ProductOptions
                key={id}
                productOptions={options}
                onSelectOption={handleSelectOption}
                selectedOptions={selectedOptions}
              />
            </div>
          )}

          {/* Quantity Selector */}
          <QuantitySelector
            max={selectedVariant?.stock}
            quantity={quantity}
            disabled={isOutOfStock || isAddingToCart}
            onChange={handleQuantityChange}
          />

          {stockFeedback && (
            <p className="mt-3 text-sm text-red-500">{stockFeedback}</p>
          )}
        </div>

        {/* ========== SEÇÃO INFERIOR ========== */}
        <div className="shrink-0 border-t border-zinc-200 pt-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant || isOutOfStock}
              className={`flex-1 cursor-pointer px-8 py-4 font-bold text-white uppercase transition-colors disabled:cursor-not-allowed ${
                isOutOfStock ? "bg-gray-400" : "bg-black hover:bg-black/80 disabled:opacity-50"
              }`}
            >
              {isAddingToCart
                ? "Adicionando..."
                : isOutOfStock
                  ? "Indisponível"
                  : "Adicionar ao Carrinho"}
            </button>

            <button
              onClick={handleToggleWishlist}
              className="group cursor-pointer rounded-full border border-black/10 p-3 transition-transform hover:scale-110 active:scale-130"
            >
              <Heart
                className={`size-9 ${
                  isWishlisted ? "fill-red-500 text-red-500" : "fill-gray-400 text-gray-400"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
