import type { AdminSearchProductsResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { productServices } from "../services";
import v from "../validators";

export const searchAdminProducts: RequestHandler = async (
  req,
  res: Response<AdminSearchProductsResponse>
) => {
  const { query } = v.searchAdmin.getValidatedValues(req);
  const result = await productServices.searchAdminProducts(query);

  res.json(result);
};
