import { GetProductsResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/products/helpers/validators";
import { ProductMapper } from "@/modules/products/mappers";

import { productServices } from "../services";

export const getAllProducts: RequestHandler = async (req, res: Response<GetProductsResponse>) => {
  const { query } = v.getAll.getValidatedValues(req);
  const { categoryId, limit, offset, onSale } = query;

  const { enrichedProducts } = await productServices.findMany({
    categoryId,
    offset,
    limit,
    onSale,
  });

  const { products } = ProductMapper.toCatalogSummary(enrichedProducts);

  return res.json({ products });
};
