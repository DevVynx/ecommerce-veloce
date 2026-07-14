"use client";

import type { AdminGetCustomersRequest } from "@repo/types/contracts";
import { parseAsIndex, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";

import { CustomerFilters, sortValues } from "@/shared/components/Admin/Customers/CustomerFilters";
import { CustomerTable } from "@/shared/components/Admin/Customers/CustomerTable";
import { useAdminCustomers } from "@/shared/hooks/data/adminQueries/useCustomer";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

const ROW_HEIGHT = 68;
const FILTERS_OFFSET = 350;
const MIN_LIMIT = 5;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const parsers = {
  q: parseAsString,
  sortBy: parseAsStringLiteral(sortValues).withDefault("recent"),
  page: parseAsIndex.withDefault(0),
};

function AdminCustomersPageContent() {
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

  const params: AdminGetCustomersRequest = {
    q: sp.q ?? undefined,
    sortBy: sp.sortBy,
    page: sp.page + 1,
    limit,
  };

  const { data, isLoading, isError } = useAdminCustomers(params);

  const handleFilterChange = useCallback(
    (updates: Partial<{ q: string | null; sortBy: (typeof sortValues)[number] }>) => {
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
        <h1 className="text-3xl font-bold">Clientes</h1>
      </div>

      <div className="mb-6">
        <CustomerFilters values={sp} onChange={handleFilterChange} />
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-16 text-center">Carregando clientes...</div>
      )}

      {isError && (
        <div className="text-destructive py-16 text-center">
          Erro ao carregar clientes. Tente novamente.
        </div>
      )}

      {data && <CustomerTable data={data} page={sp.page + 1} onPageChange={handlePageChange} />}
    </>
  );
}

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={null}>
      <AdminCustomersPageContent />
    </Suspense>
  );
}
