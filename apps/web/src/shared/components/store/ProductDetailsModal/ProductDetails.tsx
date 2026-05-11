import type {
  CartItemDto,
  ProductOptionDto,
  PublicProductDto,
  PublicVariantDto,
} from "@repo/types/contracts";
import { motion, useAnimation } from "framer-motion";
import { Heart, Star } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

import { addItemToCart } from "@/shared/actions/cart/addItem";
import { addToWishlist } from "@/shared/actions/wishlist/addToWishlist";
import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { Rating, RatingItem } from "@/shared/components/shadcn-ui/rating";
import { useCartState } from "@/shared/states/cart";
import { useWishlistState } from "@/shared/states/wishlist";
import { authenticatedAction } from "@/shared/utils/api/authenticatedAction";

import { ProductOptions } from "./ProductOptions";
import { QuantitySelector } from "./QuantitySelector";

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
  const controls = useAnimation();
  const {
    addItem: optimisticAddItemToCart,
    rollback: optimisticRollbackCart,
    updateItemId: optimisticUpdateCartItemId,
  } = useCartState();
  const {
    add: optimisticAddToWishlist,
    remove: optimisticRemoveFromWishlist,
    rollback: optimisticRollbackWishlist,
    hasHydrated: hasHydratedWishlist,
    ids: wishlistIds,
  } = useWishlistState();

  const [showError, setShowError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { id, title, ratingRate, ratingCount } = selectedProduct;
  const isWishlisted = hasHydratedWishlist && wishlistIds.includes(id);

  useEffect(() => {
    const displayVariant = variants.find((v) => v.id === selectedProduct.display.variantId);
    const initial: Record<string, string> = {};

    if (displayVariant) {
      for (const option of options) {
        const valueId = displayVariant.optionValueIds.find((id) =>
          option.values.some((v) => v.id === id)
        );
        if (valueId) {
          initial[option.id] = valueId;
        }
      }
    }

    setSelectedOptions(initial);
    setQuantity(1);
    setShowError(false);
  }, [selectedProduct.id, variants, options]);

  const handleToggleWishlist = async () => {
    if (isWishlisted) {
      optimisticRemoveFromWishlist(id);
      const { error } = await authenticatedAction(removeFromWishlist, { productId: id });
      if (error) optimisticRollbackWishlist();
    } else {
      optimisticAddToWishlist(id);
      const { error } = await authenticatedAction(addToWishlist, { productId: id });
      if (error) optimisticRollbackWishlist();
    }
  };

  const findSelectedVariant = (): PublicVariantDto | null => {
    if (options.length === 0) {
      return {
        id: selectedProduct.display.variantId,
        sku: "",
        price: selectedProduct.display.price,
        salePrice: selectedProduct.display.salePrice,
        isOnSale: selectedProduct.display.isOnSale,
        isAvailable: selectedProduct.display.isAvailable,
        optionValueIds: [],
      };
    }

    // Verifica se todas as opções foram selecionadas
    const selectedValueIds = Object.values(selectedOptions);
    if (selectedValueIds.length !== options.length) return null;

    return (
      variants.find((variant) => {
        if (variant.optionValueIds.length !== selectedValueIds.length) return false;
        return variant.optionValueIds.every((id) => selectedValueIds.includes(id));
      }) || null
    );
  };

  const activeVariant = findSelectedVariant();
  const displayPrice = activeVariant?.price ?? selectedProduct.display.price;
  const displaySalePrice = activeVariant?.salePrice ?? selectedProduct.display.salePrice;
  const displayIsOnSale = activeVariant?.isOnSale ?? selectedProduct.display.isOnSale;

  const buildSelectedOptionsForCart = (): Array<{ name: string; value: string }> => {
    return Object.entries(selectedOptions).map(([optionId, valueId]) => {
      const option = options.find((opt) => opt.id === optionId);
      const value = option?.values.find((val) => val.id === valueId);
      return {
        name: option?.name ?? "Unknown",
        value: value?.value ?? "Unknown",
      };
    });
  };

  const handleAddToCart = async () => {
    if (isAddingToCart) return;

    const selectedVariant = findSelectedVariant();

    if (!selectedVariant) {
      setShowError(true);
      controls.start({
        x: [0, -8, 8, -8, 8, -8, 8, -6, 6, 0],
        transition: {
          duration: 0.8,
          ease: "easeInOut",
        },
      });
      return;
    }

    setIsAddingToCart(true);

    const payload = {
      productVariantId: selectedVariant.id,
      quantity: quantity,
    };

    const optimisticCartItem = {
      id: `temp-${Date.now()}`,
      quantity: payload.quantity,
      product: {
        id: selectedProduct.id,
        title: selectedProduct.title,
        variant: {
          id: selectedVariant.id,
          image: selectedProduct.display.image,
          price: selectedVariant.price,
          salePrice: selectedVariant.salePrice,
          isOnSale: displayIsOnSale,
          isAvailable: selectedVariant.isAvailable,
        },
      },
      selectedOptions: buildSelectedOptionsForCart(),
    } as CartItemDto;

    optimisticAddItemToCart(optimisticCartItem);

    const { data, error } = await authenticatedAction(addItemToCart, payload);

    if (error) {
      optimisticRollbackCart();
    } else if (data?.cartItem) {
      optimisticUpdateCartItemId(optimisticCartItem.id, data.cartItem.id);
    }

    setIsAddingToCart(false);
    onClose();
  };

  const handleIncrement = () => setQuantity(quantity + 1);

  const handleDecrement = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const handleSelectOption = (optionId: string, valueId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: valueId,
    }));

    if (showError) {
      setShowError(false);
    }
  };

  const percentDiscount = displayIsOnSale
    ? Math.round(100 - (displaySalePrice / displayPrice) * 100)
    : 0;

  return (
    <div className="flex h-125 gap-10">
      {/* Imagem - lado esquerdo */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full items-center justify-center bg-black/10 p-4">
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

          {/* Price */}
          <div className="flex items-center gap-2 border-b border-zinc-300 pb-3">
            <strong className="text-2xl font-semibold text-gray-800">
              R$ {displaySalePrice.toFixed(2)}
            </strong>
            {displayIsOnSale && (
              <>
                <span className="rounded-sm bg-red-500 px-1.5 py-0.5 text-sm font-bold text-white">
                  -{percentDiscount}%
                </span>
                <span className="text-sm text-red-500 line-through">
                  R$ {displayPrice.toFixed(2)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ========== SEÇÃO DO MEIO (scroll) ========== */}
        <div className="min-h-0 flex-1 overflow-y-auto py-2 pr-2 pl-2">
          {/* Product Options */}
          <motion.div animate={controls}>
            {options.length > 0 && (
              <div className="mb-6">
                <ProductOptions
                  key={id}
                  productOptions={options}
                  onSelectOption={handleSelectOption}
                  selectedOptions={selectedOptions}
                />

                {/* Mensagem de erro */}
                {showError && (
                  <p className="mt-2 text-sm text-red-500">
                    Por favor, selecione todas as opções antes de adicionar ao carrinho.
                  </p>
                )}
              </div>
            )}
          </motion.div>

          {/* Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            onDecrement={handleDecrement}
            onIncrement={handleIncrement}
          />
        </div>

        {/* ========== SEÇÃO INFERIOR ========== */}
        <div className="shrink-0 border-t border-zinc-200 pt-4">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 cursor-pointer bg-black px-8 py-4 font-bold text-white uppercase transition-colors hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAddingToCart ? "Adicionando..." : "Adicionar ao Carrinho"}
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
