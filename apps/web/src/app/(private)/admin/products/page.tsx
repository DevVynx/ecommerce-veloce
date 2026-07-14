"use client";

import type { AdminSearchProductsRequest } from "@repo/types/contracts";
import Link from "next/link";
import { parseAsIndex, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";

import { PlusIcon } from "@/shared/assets/animatedIcons/plus";
import type { ProductFiltersValue } from "@/shared/components/Admin/Products/ProductFilters";
import { ProductFilters, sortValues } from "@/shared/components/Admin/Products/ProductFilters";
import { ProductTable } from "@/shared/components/Admin/Products/ProductTable";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAdminSearchProducts } from "@/shared/hooks/data/adminQueries/useProduct";
import { useAnimatedIcons } from "@/shared/hooks/ui/useAnimatedIcons";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

const ROW_HEIGHT = 68;
const FILTERS_OFFSET = 400;
const MIN_LIMIT = 5;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const parsers = {
  q: parseAsString,
  categoryId: parseAsString,
  status: parseAsStringLiteral(["active", "inactive"] as const),
  stock: parseAsStringLiteral(["low", "out"] as const),
  sort: parseAsStringLiteral(sortValues).withDefault("newest"),
  page: parseAsIndex.withDefault(0),
};

function AdminProductsPageContent() {
  const { height } = useScreenSize();
  const { getIconRef, getHandlers } = useAnimatedIcons({
    autoStartDelay: 200,
    autoStartDuration: 1500,
  });
  const [sp, setSearchParams] = useQueryStates(parsers);

  const limit = useMemo(
    () =>
      height
        ? Math.max(
            MIN_LIMIT,
            Math.min(MAX_LIMIT, Math.floor((height - FILTERS_OFFSET) / ROW_HEIGHT))
          )
        : DEFAULT_LIMIT,
    [height]
  );

  const prevLimitRef = useRef(limit);
  useEffect(() => {
    if (prevLimitRef.current !== limit) {
      prevLimitRef.current = limit;
      setSearchParams({ page: null });
    }
  }, [limit, setSearchParams]);

  const params: AdminSearchProductsRequest = {
    q: sp.q ?? undefined,
    categoryId: sp.categoryId ?? undefined,
    isActive: sp.status === "active" ? true : sp.status === "inactive" ? false : undefined,
    stockLt: sp.stock === "low" ? 6 : sp.stock === "out" ? 1 : undefined,
    sortBy: sp.sort,
    page: sp.page + 1,
    limit,
  };

  const { data, isLoading, isError } = useAdminSearchProducts(params);

  const handleFilterChange = useCallback(
    (updates: Partial<ProductFiltersValue>) => {
      setSearchParams({ ...updates, page: null });
    },
    [setSearchParams]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      setSearchParams({ page: p - 1 });
    },
    [setSearchParams]
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button asChild {...getHandlers("create")}>
          <Link href="/admin/products/create">
            <PlusIcon ref={getIconRef("create")} size={18} className="mr-2" />
            Criar Produto
          </Link>
        </Button>
      </div>

      <div className="mb-6">
        <ProductFilters values={sp} onChange={handleFilterChange} />
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-16 text-center">Carregando produtos...</div>
      )}

      {isError && (
        <div className="text-destructive py-16 text-center">
          Erro ao carregar produtos. Tente novamente.
        </div>
      )}

      {data && <ProductTable data={data} page={sp.page + 1} onPageChange={handlePageChange} />}
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={null}>
      <AdminProductsPageContent />
    </Suspense>
  );
}
