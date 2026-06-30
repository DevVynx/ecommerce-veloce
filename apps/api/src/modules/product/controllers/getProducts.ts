import { GetProductsResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import { ProductMapper } from "@/modules/product/mappers";
import v from "@/modules/product/validators";

import { productServices } from "../services";

export const getAllProducts: RequestHandler = async (req, res: Response<GetProductsResponse>) => {
  const { query } = v.getAll.getValidatedValues(req);
  const { categoryId, limit, offset, onSale } = query;

  const { enrichedProducts, pagination } = await productServices.findMany({
    categoryId,
    offset,
    limit,
    onSale,
  });

  const { products } = ProductMapper.toCatalogSummary(enrichedProducts);

  return res.json({ products, pagination });
};
