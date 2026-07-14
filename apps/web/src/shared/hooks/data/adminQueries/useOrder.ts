import type {
  AdminActiveOrdersRequest,
  AdminActiveOrdersResponse,
  AdminGetOrdersRequest,
  AdminListOrdersResponse,
} from "@repo/types/contracts";
import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/utils/api/fetchClient";
import { withAuthRefresh } from "@/shared/utils/api/withAuthRefresh";

export function useAdminOrders(params: AdminGetOrdersRequest) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {};

      if (params) {
        if (params.limit) queryParams.limit = params.limit;
        if (params.page !== undefined) queryParams.page = params.page;
        if (params.sort !== undefined) queryParams.sort = params.sort;
        if (params.q) queryParams.q = params.q;
        if (params.status) queryParams.status = params.status;
      }

      const { data, error } = await withAuthRefresh(() =>
        fetchClient<AdminListOrdersResponse>(`/admin/orders`, {
          isPrivate: true,
          params: queryParams,
        })
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useAdminCountActiveOrders(params: AdminActiveOrdersRequest) {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {};

      if (params) {
        if (params.range) queryParams.range = params.range;
      }

      const { data, error } = await withAuthRefresh(() =>
        fetchClient<AdminActiveOrdersResponse>(`/admin/orders/active`, {
          isPrivate: true,
          params: queryParams,
        })
      );

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}
