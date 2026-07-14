"use client";

import type { AdminGetOrdersRequest } from "@repo/types/contracts";
import { parseAsIndex, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";

import { OrderFilters, sortValues } from "@/shared/components/Admin/Orders/OrderFilters";
import { OrderTable } from "@/shared/components/Admin/Orders/OrderTable";
import { useAdminOrders } from "@/shared/hooks/data/adminQueries/useOrder";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

const ROW_HEIGHT = 68;
const FILTERS_OFFSET = 400;
const MIN_LIMIT = 5;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const parsers = {
  q: parseAsString,
  status: parseAsString,
  sort: parseAsStringLiteral(sortValues).withDefault("newest"),
  page: parseAsIndex.withDefault(0),
};

function AdminOrdersPageContent() {
  const { height } = useScreenSize();
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

  const sortMap: Record<(typeof sortValues)[number], "asc" | "desc"> = {
    newest: "desc",
    oldest: "asc",
  };

  const params: AdminGetOrdersRequest = {
    q: sp.q ?? undefined,
    status: sp.status ?? undefined,
    sort: sortMap[sp.sort],
    page: sp.page + 1,
    limit,
  };

  const { data, isLoading, isError } = useAdminOrders(params);

  const handleFilterChange = useCallback(
    (
      updates: Partial<{
        q: string | null;
        status: string | null;
        sort: (typeof sortValues)[number];
      }>
    ) => {
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
        <h1 className="text-3xl font-bold">Pedidos</h1>
      </div>

      <div className="mb-6">
        <OrderFilters values={sp} onChange={handleFilterChange} />
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-16 text-center">Carregando pedidos...</div>
      )}

      {isError && (
        <div className="text-destructive py-16 text-center">
          Erro ao carregar pedidos. Tente novamente.
        </div>
      )}

      {data && <OrderTable data={data} page={sp.page + 1} onPageChange={handlePageChange} />}
    </>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={null}>
      <AdminOrdersPageContent />
    </Suspense>
  );
}
