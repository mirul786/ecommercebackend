import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  UpdateUserConoller,
  getOrderController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authmiddleware.js";

// router object
const router = express.Router();

//routing
// Register || Method --> Post
router.post("/register", registerController);

// Login || Method --> Post
router.post("/login", loginController);

// forgot password post
router.post("/forgot-password", forgotPasswordController);

//test routes
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

// update user
router.put("/profile", requireSignIn, UpdateUserConoller);

//orders
router.get("/order", requireSignIn, getOrderController);

//orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//update order status
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
