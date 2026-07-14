import type { AdminSearchCustomersResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { userServices } from "@/modules/user/services";
import v from "@/modules/user/validators";

export const searchCustomers: RequestHandler = async (
  req,
  res: Response<AdminSearchCustomersResponse>
) => {
  const { query } = v.searchCustomers.getValidatedValues(req);
  const result = await userServices.searchCustomers(query);
  res.json(result);
};
