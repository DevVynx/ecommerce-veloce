import type {
  CatalogProductDto,
  ProductOptionDto,
  VariantDto,
  WishlistItemDto,
} from "@repo/types/contracts";
import { Heart, Star } from "lucide-react";
import { useEffect, useState } from "react";

import { addToWishlist } from "@/shared/actions/wishlist/addToWishlist";
import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { Button } from "@/shared/components/shadcn-ui/button";
import { Rating, RatingItem } from "@/shared/components/shadcn-ui/rating";
import { showNotification } from "@/shared/components/showNotification";
import { ProductGallery } from "@/shared/components/Store/ProductDetails/ProductGallery";
import { StockBadge } from "@/shared/components/Store/StockBadge";
import { useCartMutations } from "@/shared/hooks/data/useCartMutations";
import { useProductVariantSelection } from "@/shared/hooks/data/useProductVariantSelection";
import { useWishlistState } from "@/shared/states/wishlist";
import { buildSelectedOptionsForCart } from "@/shared/utils/store/buildSelectedOptions";
import { formatPrice } from "@/shared/utils/store/price";

import { ProductOptions } from "./ProductOptions";
import { QuantitySelector } from "./QuantitySelector";

type ProductDetailsProps = {
  onClose: () => void;
  selectedProduct: CatalogProductDto;
  variants: VariantDto[];
  options: ProductOptionDto[];
};

export const ProductDetails = ({
  selectedProduct,
  onClose,
  variants,
  options,
}: ProductDetailsProps) => {
  const { addItemToCart, isLoading: isAddingToCart } = useCartMutations();
  const displayVariantObj = variants.find((v) => v.id === selectedProduct.display.variantId);
  const displayVariantStock = displayVariantObj?.stock ?? 0;
  const displayVariantImages = displayVariantObj?.images ?? [];
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
      images: displayVariantImages,
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

  const { id, title, ratingRate, ratingCount, description, display, slug } = selectedProduct;
  const galleryImages = selectedVariant?.images?.map((i) => i.url) ?? [display.image];
  const isOutOfStock = !!selectedVariant && !selectedVariant.isAvailable;
  const isWishlisted = hasHydratedWishlist && wishlistIds.includes(id);

  useEffect(() => {
    setQuantity(1);
    setStockFeedback(null);
  }, [id, selectedOptions, variants, options]);

  const displayPrice = selectedVariant?.price ?? display.price;
  const displaySalePrice = selectedVariant?.salePrice ?? display.salePrice;
  const displayIsOnSale = selectedVariant?.isOnSale ?? display.isOnSale;

  const handleAddToCart = async () => {
    if (isAddingToCart || !selectedVariant) return;

    const result = await addItemToCart({
      productVariantId: selectedVariant.id,
      quantity,
      stock: selectedVariant.stock,
      productId: id,
      productSlug: slug,
      productTitle: title,
      variantId: selectedVariant.id,
      image: selectedVariant.images[0]?.url ?? display.image,
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
      const { error } = await removeFromWishlist({ productId: id });
      if (error) optimisticRollbackWishlist();
    } else {
      const wishlistItem: WishlistItemDto = {
        id,
        product: {
          id,
          slug: slug,
          title: title,
          ratingRate: ratingRate,
          ratingCount: ratingCount,
          display: { ...display },
        },
      };

      optimisticAddToWishlist(wishlistItem);
      const { error } = await addToWishlist({ productId: id });
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

  return (
    <div className="flex h-125 gap-10">
      {/* Imagem - lado esquerdo */}
      <ProductGallery
        key={selectedVariant?.id ?? "no-variant"}
        title={title}
        images={galleryImages}
      />

      {/* Detalhes - lado direito */}
      <div className="flex h-full w-160 flex-col">
        {/* ========== SEÇÃO SUPERIOR ========== */}
        <div className="shrink-0">
          <h1 className="text-2xl leading-tight font-bold">{title}</h1>
          <p className="line-clamp-3 text-sm leading-5">{description}</p>

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
            {selectedVariant && <StockBadge stock={selectedVariant.stock} />}
          </div>
        </div>

        {/* ========== SEÇÃO DO MEIO (scroll) ========== */}
        <div
          className={`flex min-h-0 flex-1 flex-col overflow-y-auto pt-2 pb-4 ${options.length > 0 ? "justify-between" : "justify-end"}`}
        >
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

          {stockFeedback && <p className="mt-3 text-sm text-red-500">{stockFeedback}</p>}
        </div>

        {/* ========== SEÇÃO INFERIOR ========== */}
        <div className="shrink-0 border-t border-zinc-200 pt-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={isAddingToCart || !selectedVariant || isOutOfStock}
              className="w-75 flex-1 shrink-0 rounded-lg py-5 font-mono text-xs font-bold tracking-[0.2em] uppercase sm:text-sm"
            >
              {isAddingToCart
                ? "Adicionando..."
                : isOutOfStock
                  ? "Indisponível"
                  : "Adicionar ao Carrinho"}
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleWishlist}
              className="h-15 rounded-lg"
              aria-label={isWishlisted ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                className={`size-8 ${isWishlisted ? "fill-red-500 text-red-500" : "fill-gray-400 text-gray-400"}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
