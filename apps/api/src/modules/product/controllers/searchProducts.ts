import { SearchProductsResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import { ProductMapper } from "@/modules/product/mappers";
import v from "@/modules/product/validators";

import { productServices } from "../services";

export const searchProducts: RequestHandler = async (
  req,
  res: Response<SearchProductsResponse>
) => {
  const { query } = v.searchProducts.getValidatedValues(req);
  const { q, categoryId, onSale, minRating, optionValues, sortBy, offset, limit } = query;

  const { enrichedProducts, pagination, filters } = await productServices.search({
    q,
    categoryId,
    onSale,
    minRating,
    optionValues,
    sortBy,
    offset,
    limit,
  });

  const { products } = ProductMapper.toCatalogSummary(enrichedProducts);

  return res.json({
    products,
    filters,
    pagination,
  });
};
