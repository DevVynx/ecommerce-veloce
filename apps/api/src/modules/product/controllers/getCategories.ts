import type { GetCategoriesResponse } from "@repo/types/contracts";
import type { RequestHandler, Response } from "express";

import { productServices } from "../services";

export const getCategories: RequestHandler = async (_req, res: Response<GetCategoriesResponse>) => {
  const categories = await productServices.getCategories();
  res.json({ categories });
};
