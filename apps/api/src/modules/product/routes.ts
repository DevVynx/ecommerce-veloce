import { Router } from "express";

import v from "@/modules/product/validators";
import { adminOnlyMiddleware } from "@/shared/middlewares/adminOnly";
import { authMiddleware } from "@/shared/middlewares/auth";
import { uploadMiddleware } from "@/shared/middlewares/upload";

import {
  countLowStockVariants,
  createProduct,
  getAllProducts,
  getCategories,
  getProductBySlug,
  getProductDetails,
  searchAdminProducts,
  searchProducts,
  uploadVariantImage,
} from "./controllers";

const productRouter: Router = Router();

productRouter.get("/categories", getCategories);
productRouter.get("/products", v.getAll.middleware, getAllProducts);
productRouter.get("/products/search", v.searchProducts.middleware, searchProducts);
productRouter.get("/products/:productId", v.getById.middleware, getProductDetails);
productRouter.get("/products/slug/:slug", v.getBySlug.middleware, getProductBySlug);

productRouter.get(
  "/admin/products/lowStock",
  authMiddleware,
  adminOnlyMiddleware,
  countLowStockVariants
);

productRouter.get(
  "/admin/products/search",
  authMiddleware,
  adminOnlyMiddleware,
  v.searchAdmin.middleware,
  searchAdminProducts
);

productRouter.post(
  "/admin/products/uploadImage",
  authMiddleware,
  adminOnlyMiddleware,
  uploadMiddleware.single("file"),
  uploadVariantImage
);

productRouter.post(
  "/admin/products",
  authMiddleware,
  adminOnlyMiddleware,
  v.createProduct.middleware,
  createProduct
);

export { productRouter };
