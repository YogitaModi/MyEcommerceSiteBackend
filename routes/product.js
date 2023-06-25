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
  filterProductController,
  searchProductController,
  relatedProductController,
  productCategoryController,
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

// fetching filtering product
router.post("/filter-product", filterProductController);

// search product
router.get("/search/:keyword", searchProductController);
// end point deleting a product
router.delete(
  "/delete-product/:id",
  requireSignIn,
  isAdmin,
  deleteProductController
);

// showing related products
router.get("/related-product/:pid/:cid", relatedProductController);

// category wise products
router.get("/product-category/:slug", productCategoryController);

module.exports = router;
