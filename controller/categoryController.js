import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

const CreateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.send({
        message: "Name is required",
      });
    }
    //check for any existing category with the same name
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(201).send({
        success: false,
        message: "Category already exists",
      });
    }

    // create new category
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New category created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Category",
      error,
    });
  }
};

// update Category
const UpdateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating catergory",
      error,
    });
  }
};

// Get All catergories controller
const AllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find();
    res.status(200).send({
      success: true,
      message: "get all categories successfully",
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong while getting all categories",
      error,
    });
  }
};

// Get single Category

const SingleCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Get single category successfull",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
    });
  }
};

// Delete category
const DeleteCategories = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteCategory = await categoryModel.findByIdAndDelete(id).select("-image");
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
      deleteCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting this category",
      error,
    });
  }
};

export {
  CreateCategoryController,
  UpdateCategoryController,
  AllCategoriesController,
  SingleCategoryController,
  DeleteCategories,
};
