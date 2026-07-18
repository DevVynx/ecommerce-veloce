import { RequestHandler } from "express";

import { productServices } from "@/modules/product/services";
import v from "@/modules/product/validators";

export const createProduct: RequestHandler = async (req, res) => {
  const body = v.createProduct.getValidatedValues(req).body;
  const result = await productServices.createProduct(body);

  res.status(201).json(result);
};
