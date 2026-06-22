import { GetProductDetailsResponse } from "@repo/types/contracts";
import { RequestHandler, Response } from "express";

import v from "@/modules/products/validators";
import { ProductMapper } from "@/modules/products/mappers";

import { productServices } from "../services";

export const getProductDetails: RequestHandler = async (
  req,
  res: Response<GetProductDetailsResponse>
) => {
  const { params } = v.getById.getValidatedValues(req);
  const { productId } = params;

  const { enrichedProduct } = await productServices.findById({
    productId,
  });

  const { product, options, variants } = ProductMapper.toProductDetails(enrichedProduct);

  return res.json({ product, options, variants });
};
