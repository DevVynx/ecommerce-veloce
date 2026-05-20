"use client";
import type { PublicProductDto } from "@repo/types/contracts";
import { useEffect, useState } from "react";

import { getProducts } from "@/shared/actions/products/getProducts";
import { ProductCard } from "@/shared/components/store/ProductCard";
import { ProductCardSkeleton } from "@/shared/components/store/ProductCardSkeleton";
import { useCartState } from "@/shared/states/cart";

export const CartSuggestions = () => {
  const { cart } = useCartState();

  const [products, setProducts] = useState<PublicProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const { data } = await getProducts({ limit: 8 });
        setProducts(data?.products || []);
      } catch (error) {
        console.error("Erro ao buscar sugestões", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (cart.items.length > 0) {
      fetchSuggestions();
    }
  }, [cart.items]);

  if (isLoading) {
    return (
      <section className="pt-10">
        <h2 className="mb-4 text-center text-xl font-bold">Recomendações para você!</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} grid />
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="pt-10">
      <h2 className="mb-6 text-center text-xl font-bold">Recomendações para você!</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} grid />
        ))}
      </div>
    </section>
  );
};
