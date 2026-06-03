"use client";
import type { PublicProductDto } from "@repo/types/contracts";
import { useRef, useState } from "react";

import { getProducts } from "@/shared/actions/products/getProducts";
import { ProductCard } from "@/shared/components/Store/ProductCard";
import { ProductCardSkeleton } from "@/shared/components/Store/ProductCardSkeleton";
import { useInfiniteScroll } from "@/shared/hooks/ui/useInfiniteScroll";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

type ForYouSectionContentProps = {
  products: PublicProductDto[];
};

export const ForYouSectionContent = ({ products }: ForYouSectionContentProps) => {
  const { isMobile } = useScreenSize();

  const [productsList, setProductsList] = useState<PublicProductDto[]>(products);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const offsetRef = useRef(products.length);
  const limit = isMobile ? 9 : 16;

  const [sentinelRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasMore,
    rootMargin: "600px",
    onLoadMore: async () => {
      setIsLoading(true);
      const { data, error } = await getProducts({ limit, offset: offsetRef.current });
      setIsLoading(false);
      if (!data || error) return;

      setProductsList((prev) => [...prev, ...data.products]);
      offsetRef.current += limit;

      if (data.products.length < limit) {
        setHasMore(false);
      }
    },
  });

  return (
    <section id="forYouSection" className="px-2 py-12">
      <div className="mx-auto lg:container">
        <h1 className="text-center text-xl font-bold">Para você!</h1>

        <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
          {productsList.map((product) => (
            <ProductCard key={product.id} product={product} grid />
          ))}
        </div>

        {hasMore && <div ref={sentinelRef} />}

        {isLoading && (
          <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: limit }).map((_, index) => (
              <ProductCardSkeleton key={index} grid />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
