import type {
  AdminCountLowStockVariantsResponse,
  AdminSearchProductsRequest,
  AdminSearchProductsResponse,
} from "@repo/types/contracts";
import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/utils/api/fetchClient";
import { withAuthRefresh } from "@/shared/utils/api/withAuthRefresh";

export function useAdminSearchProducts(params: AdminSearchProductsRequest) {
  return useQuery({
    queryKey: ["admin", "products", "search", params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {};

      if (params) {
        if (params.q) queryParams.q = params.q;
        if (params.categoryId) queryParams.categoryId = params.categoryId;
        if (params.isActive !== undefined)
          queryParams.isActive = params.isActive ? "true" : "false";
        if (params.stockLt !== undefined) queryParams.stockLt = params.stockLt;
        if (params.sortBy) queryParams.sortBy = params.sortBy;
        if (params.page) queryParams.page = params.page;
        if (params.limit) queryParams.limit = params.limit;
      }

      const { data, error } = await withAuthRefresh(() =>
        fetchClient<AdminSearchProductsResponse>("/admin/products/search", {
          isPrivate: true,
          params: queryParams,
        })
      );

      if (error) {
        throw new Error((error.message as string) || "Erro ao buscar produtos");
      }

      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminLowStockProducts() {
  return useQuery({
    queryKey: ["admin", "dashboard", "products"],
    queryFn: async () => {
      const { data, error } = await withAuthRefresh(() =>
        fetchClient<AdminCountLowStockVariantsResponse>(`/admin/products/lowStock`, {
          isPrivate: true,
        })
      );

      if (error) {
        throw new Error((error.message as string) || "Erro ao contar estoque");
      }

      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}
