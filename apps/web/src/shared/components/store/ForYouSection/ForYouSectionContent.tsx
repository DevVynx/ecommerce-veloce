"use client";
import type { PublicProductDto } from "@repo/types/contracts";
import { useEffect, useRef, useState } from "react";

import { getProducts } from "@/shared/actions/products/getProducts";
import { ProductCard } from "@/shared/components/store/ProductCard";
import { ProductCardSkeleton } from "@/shared/components/store/Skeletons/ProductCardSkeleton";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

type ForYouSectionContentProps = {
  products: PublicProductDto[];
};

export const ForYouSectionContent = ({ products }: ForYouSectionContentProps) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(products.length);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [productsList, setProductsList] = useState<PublicProductDto[]>(products);

  const { isMobile } = useScreenSize();

  const LIMIT = isMobile ? 9 : 16;

  const fetchMoreProducts = async () => {
    setIsLoading(true);

    const { data, error } = await getProducts({ limit: LIMIT, offset: offset });
    if (!data || error) {
      setIsLoading(false);
      return;
    }

    setProductsList((prevProducts) => [...prevProducts, ...data.products]);
    setOffset((prevOffset) => prevOffset + LIMIT);
    if (data.products.length < LIMIT) setHasMore(false);
    setIsLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting && hasMore && !isLoading) {
          fetchMoreProducts();
        }
      },
      { rootMargin: "600px" }
    );

    if (!sentinelRef.current) return;
    observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isLoading]);

  return (
    <section id="forYouSection" className="px-2 py-12">
      <div className="mx-auto lg:container">
        <h1 className="text-center text-xl font-bold">Para você!</h1>

        <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
          {productsList.map((product) => (
            <ProductCard key={product.id} product={product} grid />
          ))}
        </div>
        <div ref={sentinelRef} />
        {isLoading && (
          <div className="grid grid-cols-2 gap-6 py-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: LIMIT }).map((_, index) => (
              <ProductCardSkeleton key={index} grid />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
