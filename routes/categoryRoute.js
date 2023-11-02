import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";
import {
  AllCategoriesController,
  CreateCategoryController,
  DeleteCategories,
  SingleCategoryController,
  UpdateCategoryController,
} from "./../controller/categoryController.js";

// Router objext

const router = express.Router();

// Route Create Category Post
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  CreateCategoryController
);

// Route Update Catagory Put
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  UpdateCategoryController
);

// Route Get All Categories
router.get("/all-categories", AllCategoriesController);

// Route Get Single Category
router.get("/single-category/:slug", SingleCategoryController);

//Delete a category
router.delete("/delete-category/:id", requireSignIn, isAdmin, DeleteCategories);

export default router;
