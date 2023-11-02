import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import {
  BraintreePaymentController,
  BraintreeTokenController,
  CreateProductController,
  DeleteProductController,
  FilterProductController,
  GetProductImageController,
  GetProductsController,
  GetSingleProductController,
  ProductCategoryController,
  ProductCountController,
  ProductListController,
  ProductSearchController,
  SimilarProductController,
  UpdateProductController,
} from "../controller/ProductController.js";
import formidableMiddleware from "express-formidable";

const router = express.Router();

//Route Create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  CreateProductController
);

// Route get all products
router.get("/get-products", GetProductsController);

//Route Single Product
router.get("/get-single-product/:slug/:_id", GetSingleProductController);

// Route Product Image
router.get("/product-image/:pid", GetProductImageController);

// Route product delete || Method: Delete
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  DeleteProductController
);

//update Product
router.put(
  "/update-product/:_id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  UpdateProductController
);

// Filter Product
router.post("/filter-product", FilterProductController)

//product count route
router.get("/product-count", ProductCountController)

// product list
router.get("/product-list/:page", ProductListController)

// Search product
router.get("/product-search/:keyword", ProductSearchController)

// similar product route
router.get("/similar-product/:pid/:cid", SimilarProductController)

// category wise get product
router.get("/product-category/:slug", ProductCategoryController)

// payment routes
//token
router.get("/braintree/token", BraintreeTokenController)

//payments
router.post("/braintree/payment", requireSignIn, BraintreePaymentController)
export default router;
