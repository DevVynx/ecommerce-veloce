import type {
  AdminDashboardTimelineRequest,
  AdminDashboardTimelineResponse,
} from "@repo/types/contracts";
import { useQuery } from "@tanstack/react-query";

import { fetchClient } from "@/shared/utils/api/fetchClient";
import { withAuthRefresh } from "@/shared/utils/api/withAuthRefresh";

export function useAdminDashboardTimeline(params: AdminDashboardTimelineRequest) {
  return useQuery({
    queryKey: ["admin", "dashboard", "timeline", params],
    queryFn: async () => {
      const queryParams: Record<string, string | number> = {};

      if (params) {
        if (params.range) queryParams.range = params.range;
      }

      const { data, error } = await withAuthRefresh(() =>
        fetchClient<AdminDashboardTimelineResponse>(`/admin/dashboard/timeline`, {
          isPrivate: true,
          params: queryParams,
        })
      );

      if (error) {
        throw new Error((error.message as string) || "Erro ao buscar timeline");
      }

      return data;
    },
    placeholderData: (previousData) => previousData,
  });
}
