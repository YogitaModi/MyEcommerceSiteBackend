const express = require("express");
const { isAdmin, requireSignIn } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  createCategorycontroller,
  updateCategoryController,
  deleteCategoryController,
  gettingCategoryController,
  singleCategoryController,
} = require("../controllers/categoryController");

// end point for creating new category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategorycontroller
);

//  end point for updating category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//  end point for getting  all categories does not require sign in
router.get("/get-categories", gettingCategoryController);

//  end point for getting single category does not require sign in
router.get("/single-category/:slug", singleCategoryController);

// end point for deleting category
router.delete(
  "/delete-category/:id",
  requireSignIn,
  isAdmin,
  deleteCategoryController
);
module.exports = router;
