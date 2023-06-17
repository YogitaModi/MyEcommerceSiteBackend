const express = require("express");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");
const formidableMiddleware = require("express-formidable");

const {
  createProductController,
  deleteProductController,
  updateProductController,
  gettingProductController,
  singleProductController,
  productImageController,
} = require("../controllers/productController");
const router = express.Router();

// end point creating new product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  createProductController
);

// end point for updating product
router.put(
  "/update-product/:id",
  requireSignIn,
  isAdmin,
  formidableMiddleware(),
  updateProductController
);

// fetching all product
router.get("/get-products", gettingProductController);

// fetching single product
router.get("/get-product/:slug", singleProductController);

// fetching product picture
router.get("/product-image/:pid", productImageController);

// end point deleting a product
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);
module.exports = router;
