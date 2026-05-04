import type {
  CartItemDto,
  ProductOptionDto,
  PublicProductDto,
  PublicVariantDto,
} from "@repo/types/contracts";
import { motion, useAnimation } from "framer-motion";
import { HeartIcon, Star } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

import { addItemToCart } from "@/shared/actions/cart/addItem";
import { addToWishlist } from "@/shared/actions/wishlist/addToWishlist";
import { removeFromWishlist } from "@/shared/actions/wishlist/removeFromWishlist";
import { useCartState } from "@/shared/states/cart";
import { useWishlistState } from "@/shared/states/wishlist";

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
  const { addItem: optimisticAddItemToCart, rollback: optimisticRollbackCart } = useCartState();
  const {
    add: optimisticAddToWishlist,
    remove: optimisticRemoveFromWishlist,
    rollback: optimisticRollbackWishlist,
    hasHydrated: hasHydratedWishlist,
    ids: wishlistIds,
  } = useWishlistState();

  const [showError, setShowError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  const { id, title, ratingRate, ratingCount } = selectedProduct;
  const { image, price, salePrice: promotionPrice, isOnSale } = selectedProduct.display;
  const isWishlisted = hasHydratedWishlist && wishlistIds.includes(id);

  const handleToggleWishlist = async () => {
    if (isWishlisted) {
      optimisticRemoveFromWishlist(id);
      const { error } = await removeFromWishlist({ productId: id });
      if (error) optimisticRollbackWishlist();
    } else {
      optimisticAddToWishlist(id);
      const { error } = await addToWishlist({ productId: id });
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

  useEffect(() => {
    setSelectedOptions({});
    setQuantity(1);
    setShowError(false);
  }, [selectedProduct.id]);

  const handleAddToCart = async () => {
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
          isOnSale: selectedProduct.display.isOnSale,
          isAvailable: selectedVariant.isAvailable,
        },
      },
      selectedOptions: buildSelectedOptionsForCart(),
    } as CartItemDto;

    optimisticAddItemToCart(optimisticCartItem);
    onClose();

    const { data, error } = await addItemToCart(payload);

    if (error) {
      optimisticRollbackCart();
    } else if (data?.cartItem) {
      useCartState.getState().updateItemId(optimisticCartItem.id, data.cartItem.id);
    }
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

  const percentDiscount = isOnSale ? Math.round(100 - (promotionPrice / price) * 100) : 0;

  return (
    <div className="flex h-125 gap-10">
      {/* Imagem - lado esquerdo */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full items-center justify-center bg-black/10 p-4">
          <img src={image} alt={title} className="max-h-full w-full object-contain" />
        </div>
      </div>

      {/* Detalhes - lado direito */}
      <div className="flex h-full flex-1 flex-col">
        {/* ========== SEÇÃO SUPERIOR ========== */}
        <div className="shrink-0">
          <h1 className="text-2xl font-bold">{title}</h1>

          {/* Rating */}
          <div className="my-3 flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`size-4 ${i < Math.round(ratingRate) ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-zinc-400">({ratingCount} Avaliações)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 border-b border-zinc-300 pb-3">
            <strong className="text-2xl font-semibold text-gray-800">
              R$ {isOnSale ? promotionPrice.toFixed(2) : price.toFixed(2)}
            </strong>
            {isOnSale && (
              <>
                <span className="rounded-sm bg-red-500 px-1.5 py-0.5 text-sm font-bold text-white">
                  -{percentDiscount}%
                </span>
                <span className="text-sm text-red-500 line-through">R$ {price.toFixed(2)}</span>
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
              className="flex-1 cursor-pointer bg-black px-8 py-4 font-bold text-white uppercase transition-colors hover:bg-black/80"
            >
              Adicionar ao Carrinho
            </button>

            <button
              onClick={handleToggleWishlist}
              className="group cursor-pointer rounded-full border border-black/10 p-3 transition-transform hover:scale-110 active:scale-130"
            >
              <HeartIcon
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
