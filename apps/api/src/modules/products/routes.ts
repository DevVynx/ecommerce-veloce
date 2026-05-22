import { Router } from "express";

import v from "@/modules/products/helpers/validators";

import { getAllProducts, getProductDetails } from "./controllers";

const productRouter: Router = Router();

productRouter.get("/products", v.getAll.middleware, getAllProducts);
productRouter.get("/products/:productId", v.getById.middleware, getProductDetails);

export { productRouter };
