import type { AdminGetCustomersRequest, AdminListCustomersResponse } from "@repo/types/contracts";
import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/utils/api/fetchClient";
import { withAuthRefresh } from "@/shared/utils/api/withAuthRefresh";

export function useAdminCustomers(params: AdminGetCustomersRequest) {
  return useQuery({
    queryKey: ["admin", "customers", params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {};

      if (params.q) queryParams.q = params.q;
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;

      const { data, error } = await withAuthRefresh(() =>
        fetchClient<AdminListCustomersResponse>("/admin/customers", {
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
