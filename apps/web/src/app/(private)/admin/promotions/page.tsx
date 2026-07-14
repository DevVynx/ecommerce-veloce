"use client";

import type { AdminSearchPromotionsRequest } from "@repo/types/contracts";
import { parseAsIndex, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";

import { PlusIcon } from "@/shared/assets/animatedIcons/plus";
import type { PromotionFiltersValue } from "@/shared/components/Admin/Promotions/PromotionFilters";
import {
  PromotionFilters,
  sortValues,
} from "@/shared/components/Admin/Promotions/PromotionFilters";
import { PromotionTable } from "@/shared/components/Admin/Promotions/PromotionTable";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAdminSearchPromotions } from "@/shared/hooks/data/adminQueries/usePromotion";
import { useAnimatedIcons } from "@/shared/hooks/ui/useAnimatedIcons";
import { useScreenSize } from "@/shared/hooks/ui/useScreenSize";

const ROW_HEIGHT = 68;
const FILTERS_OFFSET = 400;
const MIN_LIMIT = 5;
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 10;

const parsers = {
  q: parseAsString,
  status: parseAsStringLiteral(["active", "inactive"] as const),
  type: parseAsStringLiteral(["PERCENTAGE", "FIXED"] as const),
  targetType: parseAsStringLiteral(["category", "product", "variant"] as const),
  sort: parseAsStringLiteral(sortValues).withDefault("newest"),
  page: parseAsIndex.withDefault(0),
};

function AdminPromotionsPageContent() {
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

  const params: AdminSearchPromotionsRequest = {
    q: sp.q ?? undefined,
    isActive: sp.status === "active" ? true : sp.status === "inactive" ? false : undefined,
    type: sp.type ?? undefined,
    targetType: sp.targetType ?? undefined,
    sortBy: sp.sort,
    page: sp.page + 1,
    limit,
  };

  const { data, isLoading, isError } = useAdminSearchPromotions(params);

  const handleFilterChange = useCallback(
    (updates: Partial<PromotionFiltersValue>) => {
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
        <h1 className="text-3xl font-bold">Promoções</h1>
        <Button disabled {...getHandlers("create")}>
          <PlusIcon ref={getIconRef("create")} size={18} className="mr-2" />
          Criar Promoção
        </Button>
      </div>

      <div className="mb-6">
        <PromotionFilters values={sp} onChange={handleFilterChange} />
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-16 text-center">Carregando promoções...</div>
      )}

      {isError && (
        <div className="text-destructive py-16 text-center">
          Erro ao carregar promoções. Tente novamente.
        </div>
      )}

      {data && <PromotionTable data={data} page={sp.page + 1} onPageChange={handlePageChange} />}
    </>
  );
}

export default function AdminPromotionsPage() {
  return (
    <Suspense fallback={null}>
      <AdminPromotionsPageContent />
    </Suspense>
  );
}
