import fs from "fs";
import productModel from "../models/productModel.js";
import categoryModal from "../models/categoryModel.js";
import slugify from "slugify";
import braintree from "braintree";
import orderModel from "../models/orderModel.js";
import dotenv from "dotenv";

dotenv.config();

//payment gateway

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

const CreateProductController = async (req, res) => {
  try {
    const {
      name,
      seller,
      slug,
      description,
      price,
      discount,
      netPrice,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { image } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ Error: "Name is required" });
      case !seller:
        return res.status(500).send({ Error: "Seller name is required" });
      case !description:
        return res.status(500).send({ Error: "Description is required" });
      case !price:
        return res.status(500).send({ Error: "Price is required" });
      case !discount:
        return res.status(500).send({ Error: "discount is required" });
      case !netPrice:
        return res.status(500).send({ Error: "Net price is required" });
      case !category:
        return res.status(500).send({ Error: "Category is required" });
      case !quantity:
        return res.status(500).send({ Error: "Quantity is required" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ Error: "Image is required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product creates successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while creating product",
    });
  }
};

// Get-All-Products
const GetProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find()
      .populate("category")
      .select("-image")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      AllProducts: products.length,
      message: "AllProducts",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting all products",
      error,
    });
  }
};

// Single Product Controller
const GetSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug, _id: req.params._id })
      .select("-image")
      .populate("category");
    res.status(201).send({
      success: true,
      message: "Product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting the product",
      error,
    });
  }
};

//Get Product Image
const GetProductImageController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("image");
    if (product.image.data) {
      res.set("content-type", product.image.contentType);
      return res.status(200).send(product.image.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      MediaSession: "Error while getting product image",
      error,
    });
  }
};

// delete product
const DeleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//Update Product
const UpdateProductController = async (req, res) => {
  try {
    const {
      name,
      seller,
      slug,
      description,
      price,
      discount,
      netPrice,
      category,
      quantity,
      shipping,
    } = req.fields;
    const { image } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).send({ Error: "Name is required" });
      case !seller:
        return res.status(500).send({ Error: "Seller name is required" });
      case !description:
        return res.status(500).send({ Error: "Description is required" });
      case !price:
        return res.status(500).send({ Error: "Price is required" });
      case !discount:
        return res.status(500).send({ Error: "Discount is required" });
      case !netPrice:
        return res.status(500).send({ Error: "Net Price is required" });
      case !category:
        return res.status(500).send({ Error: "Category is required" });
      case !quantity:
        return res.status(500).send({ Error: "Quantity is required" });
      case image && image.size > 1000000:
        return res
          .status(500)
          .send({ Error: "Image is required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params._id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (image) {
      products.image.data = fs.readFileSync(image.path);
      products.image.contentType = image.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating product",
    });
  }
};

// filter product
const FilterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while filtering products",
      error,
    });
  }
};

// product count
const ProductCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Eroor while getting product count",
      error,
    });
  }
};

// product per page
const ProductListController = async (req, res) => {
  try {
    const perPage = 8;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find()
      .select("-image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Successfully loaded products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in per page ctrl",
      error,
    });
  }
};

// product search
const ProductSearchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-image");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while searching product",
      error,
    });
  }
};

// similar product
const SimilarProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-image")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while searching for similar products",
      error,
    });
  }
};

// category wise get product controller
const ProductCategoryController = async (req, res) => {
  try {
    const category = await categoryModal.findOne({ slug: req.params.slug });
    const products = await productModel
      .find({ category })
      .select("-image")
      .populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting products",
      error,
    });
  }
};

//payment gateway api
//token
const BraintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

//payment
const BraintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart?.map((i) => {
      total += i.price;
    });

    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export {
  CreateProductController,
  GetProductsController,
  GetSingleProductController,
  GetProductImageController,
  DeleteProductController,
  UpdateProductController,
  FilterProductController,
  ProductCountController,
  ProductListController,
  ProductSearchController,
  SimilarProductController,
  ProductCategoryController,
  BraintreeTokenController,
  BraintreePaymentController,
};
