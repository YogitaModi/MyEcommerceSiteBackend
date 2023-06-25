const Categorymodel = require("../models/Categorymodel");
const slugify = require("slugify");

const createCategorycontroller = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(401)
        .json({ success: false, message: "provide name of the category" });
    }

    // checking if this category already exsists or not
    const exsistingCategory = await Categorymodel.findOne({ name });
    if (exsistingCategory) {
      return res
        .status(200)
        .json({ success: false, message: "this category already exixts" });
    }

    // creating new category
    const category = await new Categorymodel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).json({
      success: true,
      message: "Successfully created new category",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in category",
      error,
    });
  }
};

// updateing category controller

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await Categorymodel.findByIdAndUpdate(
      id,
      {
        name,
        slug: slugify(name),
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in updating category",
      error,
    });
  }
};
// getting all category

const gettingCategoryController = async (req, res) => {
  try {
    const category = await Categorymodel.find({});
    res
      .status(200)
      .json({ success: true, message: "All category list", category });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting category",
      error,
    });
  }
};

// getting single category
const singleCategoryController = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Categorymodel.findOne({ slug });
    res.status(200).json({
      success: true,
      message: "get single category successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in getting single category",
      error,
    });
  }
};

// deleting the category
const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categorymodel.findByIdAndDelete(id);
    res.status(202).json({
      success: true,
      message: "Category deleted Successfully",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in deleting category",
      error,
    });
  }
};

module.exports = {
  createCategorycontroller,
  updateCategoryController,
  deleteCategoryController,
  gettingCategoryController,
  singleCategoryController,
};
