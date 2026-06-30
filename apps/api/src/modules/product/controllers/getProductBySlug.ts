import { GetProductDetailsResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import { ProductMapper } from "@/modules/product/mappers";
import v from "@/modules/product/validators";

import { productServices } from "../services";

export const getProductBySlug: RequestHandler = async (
  req,
  res: Response<GetProductDetailsResponse>
) => {
  const { params } = v.getBySlug.getValidatedValues(req);
  const { slug } = params;

  const { enrichedProduct } = await productServices.findBySlug({
    slug,
  });

  const { product, options, variants } = ProductMapper.toProductDetails(enrichedProduct);

  return res.json({ product, options, variants });
};
