import type { RequestHandler, Response } from "express";

import { searchServices } from "@/modules/search/services";
import v from "@/modules/search/validators";

export const searchSuggestions: RequestHandler = async (req, res: Response) => {
  const { query } = v.searchSuggestions.getValidatedValues(req);
  const result = await searchServices.searchSuggestions(query);
  res.json(result);
};
