import type { AdminDashboardStatsResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { dashboardServices } from "@/modules/dashboard/services";
import v from "@/modules/dashboard/validators";

export const stats: RequestHandler = async (req, res: Response<AdminDashboardStatsResponse>) => {
  const { range } = v.stats.getValidatedValues(req).query;
  const { currentSales, percentageDelta } = await dashboardServices.getStats(range);

  res.json({ currentSales, percentageDelta });
};
