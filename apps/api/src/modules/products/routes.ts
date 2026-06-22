import { Router } from "express";

import v from "@/modules/products/validators";

import { getAllProducts, getProductBySlug, getProductDetails, searchProducts } from "./controllers";

const productRouter: Router = Router();

productRouter.get("/products", v.getAll.middleware, getAllProducts);
productRouter.get("/products/search", v.searchProducts.middleware, searchProducts);
productRouter.get("/products/:productId", v.getById.middleware, getProductDetails);
productRouter.get("/products/slug/:slug", v.getBySlug.middleware, getProductBySlug);

export { productRouter };
