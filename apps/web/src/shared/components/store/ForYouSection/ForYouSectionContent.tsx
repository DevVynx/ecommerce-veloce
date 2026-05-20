"use client";
import type { PublicProductDto } from "@repo/types/contracts";
import { useEffect, useRef, useState } from "react";

import { getProducts } from "@/shared/actions/products/getProducts";
import { ProductCard } from "@/shared/components/store/ProductCard";
import { ProductCardSkeleton } from "@/shared/components/store/ProductCardSkeleton";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

type ForYouSectionContentProps = {
  products: PublicProductDto[];
};

export const ForYouSectionContent = ({ products }: ForYouSectionContentProps) => {
  const { isMobile } = useScreenSize();

  const sentinelRef = useRef<HTMLDivElement>(null);
  const [productsList, setProductsList] = useState<PublicProductDto[]>(products);

  const offsetRef = useRef(products.length);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const limitRef = useRef(isMobile ? 9 : 16);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    limitRef.current = isMobile ? 9 : 16;
  }, [isMobile]);

  useEffect(() => {
    setProductsList(products);
    offsetRef.current = products.length;
    hasMoreRef.current = true;
  }, [products]);

  useEffect(() => {
    let active = true;

    const fetchMore = async () => {
      isLoadingRef.current = true;
      setIsLoading(true);

      const { data, error } = await getProducts({
        limit: limitRef.current,
        offset: offsetRef.current,
      });

      if (!active) return;
      if (!data || error) {
        isLoadingRef.current = false;
        setIsLoading(false);
        return;
      }

      setProductsList((prev) => [...prev, ...data.products]);
      offsetRef.current += limitRef.current;
      if (data.products.length < limitRef.current) {
        hasMoreRef.current = false;
      }
      isLoadingRef.current = false;
      setIsLoading(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          fetchMore();
        }
      },
      { rootMargin: "600px" }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

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
            {Array.from({ length: limitRef.current }).map((_, index) => (
              <ProductCardSkeleton key={index} grid />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
