"use client";
import { Heart, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

import { addToWishlist } from "@/shared/actions/wishlist/addToWishlist";
import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { Button } from "@/shared/components/shadcn-ui/button";
import { showNotification } from "@/shared/components/showNotification";
import { useProductVariantContext } from "@/shared/context/ProductVariantContext";
import { useCartMutations } from "@/shared/hooks/data/useCartMutations";
import { useWishlistState } from "@/shared/states/wishlist";
import { buildSelectedOptionsForCart } from "@/shared/utils/store/buildSelectedOptions";

export const ProductActions = () => {
  const { product, variants, options, selectedOptions, selectedVariant, isOutOfStock } =
    useProductVariantContext();

  const { addItemToCart, isLoading: isAddingToCart } = useCartMutations();
  const {
    addItem: optimisticAddToWishlist,
    remove: optimisticRemoveFromWishlist,
    rollback: optimisticRollbackWishlist,
    hasHydrated: hasHydratedWishlist,
    ids: wishlistIds,
  } = useWishlistState();

  const [stockFeedback, setStockFeedback] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const isWishlisted = hasHydratedWishlist && wishlistIds.includes(product.id);
  const displayIsOnSale = selectedVariant?.isOnSale ?? product.display.isOnSale;

  useEffect(() => {
    setQuantity(1);
    setStockFeedback(null);
  }, [product.id, selectedOptions, variants, options]);

  const handleAddToCart = async () => {
    if (isAddingToCart || !selectedVariant) return;

    const result = await addItemToCart({
      productVariantId: selectedVariant.id,
      quantity,
      stock: selectedVariant.stock,
      productId: product.id,
      productSlug: product.slug,
      productTitle: product.title,
      variantId: selectedVariant.id,
      image: selectedVariant.images[0]?.url ?? product.display.image,
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
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > (selectedVariant?.stock ?? 99)) return;
    setQuantity(newQuantity);
  };

  const handleToggleWishlist = async () => {
    if (isWishlisted) {
      optimisticRemoveFromWishlist(product.id);
      const { error } = await removeFromWishlist({
        productId: product.id,
      });
      if (error) optimisticRollbackWishlist();
    } else {
      optimisticAddToWishlist({
        id: product.id,
        product: {
          id: product.id,
          slug: product.slug,
          title: product.title,
          ratingRate: product.ratingRate,
          ratingCount: product.ratingCount,
          display: { ...product.display },
        },
      });
      const { error } = await addToWishlist({
        productId: product.id,
      });
      if (error) optimisticRollbackWishlist();
    }
  };

  return (
    <div className="space-y-3">
      {selectedVariant && (
        <div className="my-8 flex items-center gap-3">
          <span className="text-muted-foreground text-sm font-medium">Quantidade:</span>
          <div className="border-border flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isAddingToCart}
              className="text-muted-foreground px-5 py-2.5 lg:px-4 lg:py-2"
              aria-label="Diminuir quantidade"
            >
              <Minus size={16} />
            </Button>
            <span className="border-border text-foreground flex min-w-10 items-center justify-center border-x px-2 py-1 text-sm font-semibold tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= (selectedVariant?.stock ?? 99) || isAddingToCart}
              className="text-muted-foreground px-5 py-2.5 lg:px-4 lg:py-2"
              aria-label="Aumentar quantidade"
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || !selectedVariant || isOutOfStock}
          className="h-15 flex-1 rounded-lg font-mono text-xs font-bold tracking-[0.2em] uppercase sm:text-sm"
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

      {stockFeedback && <p className="text-destructive text-sm">{stockFeedback}</p>}
    </div>
  );
};
