"use client";

import type { AdminCouponDto, AdminSearchCouponsRequest } from "@repo/types/contracts";
import { parseAsIndex, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { PlusIcon } from "@/shared/assets/animatedIcons/plus";
import type { CouponFiltersValue } from "@/shared/components/Admin/Coupons/CouponFilters";
import { CouponFilters, sortValues } from "@/shared/components/Admin/Coupons/CouponFilters";
import { CouponTable } from "@/shared/components/Admin/Coupons/CouponTable";
import { CreateCouponSheet } from "@/shared/components/Admin/Coupons/CreateCouponSheet";
import { EditCouponSheet } from "@/shared/components/Admin/Coupons/EditCouponSheet";
import { Button } from "@/shared/components/shadcn-ui/button";
import { useAdminSearchCoupons } from "@/shared/hooks/data/adminQueries/useCoupon";
import { useInvalidate } from "@/shared/hooks/lib/useInvalidate";
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
  sort: parseAsStringLiteral(sortValues).withDefault("newest"),
  page: parseAsIndex.withDefault(0),
};

function AdminCouponsPageContent() {
  const { height } = useScreenSize();
  const { getIconRef, getHandlers } = useAnimatedIcons({
    autoStartDelay: 200,
    autoStartDuration: 1500,
  });
  const [sp, setSearchParams] = useQueryStates(parsers);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCouponDto | null>(null);
  const invalidate = useInvalidate();

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

  const params: AdminSearchCouponsRequest = {
    q: sp.q ?? undefined,
    isActive: sp.status === "active" ? true : sp.status === "inactive" ? false : undefined,
    sortBy: sp.sort,
    page: sp.page + 1,
    limit,
  };

  const { data, isLoading, isError } = useAdminSearchCoupons(params);

  const handleFilterChange = useCallback(
    (updates: Partial<CouponFiltersValue>) => {
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
        <h1 className="text-3xl font-bold">Cupons</h1>
        <Button {...getHandlers("create")} onClick={() => setIsCreateOpen(true)}>
          <PlusIcon ref={getIconRef("create")} size={18} className="mr-2" />
          Criar Cupom
        </Button>
      </div>

      <CreateCouponSheet
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={() => {
          setIsCreateOpen(false);
          invalidate(["admin", "coupons", "search"]);
        }}
      />

      <div className="mb-6">
        <CouponFilters values={sp} onChange={handleFilterChange} />
      </div>

      {isLoading && (
        <div className="text-muted-foreground py-16 text-center">Carregando cupons...</div>
      )}

      {isError && (
        <div className="text-destructive py-16 text-center">
          Erro ao carregar cupons. Tente novamente.
        </div>
      )}

      {editingCoupon && (
        <EditCouponSheet
          open={!!editingCoupon}
          onOpenChange={(open) => !open && setEditingCoupon(null)}
          coupon={editingCoupon}
          onSuccess={() => {
            setEditingCoupon(null);
            invalidate(["admin", "coupons", "search"]);
          }}
        />
      )}

      {data && (
        <CouponTable
          data={data}
          page={sp.page + 1}
          onPageChange={handlePageChange}
          onEdit={setEditingCoupon}
        />
      )}
    </>
  );
}

export default function AdminCouponsPage() {
  return (
    <Suspense fallback={null}>
      <AdminCouponsPageContent />
    </Suspense>
  );
}
