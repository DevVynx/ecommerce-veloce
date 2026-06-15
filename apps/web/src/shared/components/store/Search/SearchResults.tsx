"use client";
import type { CatalogProductDto } from "@repo/types/contracts";

import { searchProducts } from "@/shared/actions/products/searchProducts";
import { ProductCard } from "@/shared/components/Store/ProductCard";
import { ProductCardSkeleton } from "@/shared/components/Store/ProductCardSkeleton";
import {
  type PaginatePayload,
  useInfScrollPagination,
} from "@/shared/hooks/data/useInfScrollPagination";
import { toSearchRequest } from "@/shared/utils/store/search";

type SearchResultsProps = {
  initialProducts: CatalogProductDto[];
  total: number;
  params: Record<string, string | string[] | undefined>;
};

export const SearchResults = ({ initialProducts, total, params }: SearchResultsProps) => {
  const loadProducts = async (
    offset: number,
    limit: number
  ): PaginatePayload<CatalogProductDto> => {
    const reqParams = { ...toSearchRequest(params), offset, limit };
    const { data, error } = await searchProducts(reqParams);

    if (!data || error) return { items: [], hasMore: false };

    return {
      items: data.products,
      hasMore: data.pagination.hasMore,
      total: data.pagination.total,
    };
  };

  const {
    items,
    isLoading,
    hasMore,
    sentinelRef,
    total: totalItems,
  } = useInfScrollPagination({
    action: loadProducts,
    limit: 12,
    initialItems: initialProducts,
    initialHasMore: initialProducts.length < total,
    initialTotal: total,
    resetKey: JSON.stringify(params),
  });

  return (
    <div>
      <p className="mb-4 text-sm text-gray-500">
        {totalItems} produto{totalItems !== 1 ? "s" : ""} encontrado
        {totalItems !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} grid />
        ))}
      </div>

      {hasMore && <div ref={sentinelRef} />}

      {isLoading && (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} grid />
          ))}
        </div>
      )}
    </div>
  );
};
