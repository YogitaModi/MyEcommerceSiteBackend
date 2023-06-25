const Productmodel = require("../models/Productmodel");
const Categorymodel = require("../models/Categorymodel");
const fs = require("fs");
const slugify = require("slugify");
const { param } = require("../routes/product");

// route for creating product
const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { image } = req.files;
    switch (true) {
      case !name:
        return res.status(500).json({ message: "Name is Required" });
      case !description:
        return res.status(500).json({ message: "Description is Required" });
      case !price:
        return res.status(500).json({ message: "Price is Required" });
      case !category:
        return res.status(500).json({ message: "Category is Required" });
      case !quantity:
        return res.status(500).json({ message: "Quantity is Required" });
      case image && image.size > 1048576:
        return res
          .status(500)
          .json({ message: "image is Required and should be less then 1mb" });
    }

    const existingProduct = await Productmodel.findOne({ name });

    if (existingProduct) {
      return res.status(200).json({
        success: false,
        message: "This product is already existing",
      });
    }
    const product = new Productmodel({
      name,
      description,
      price,
      category,
      quantity,
      slug: slugify(name),
    });
    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }
    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while creating new product",
      error,
    });
  }
};

// route for updating product
const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { image } = req.files;
    switch (true) {
      case !name:
        return res.status(500).json({ message: "Name is Required" });
      case !description:
        return res.status(500).json({ message: "Description is Required" });
      case !price:
        return res.status(500).json({ message: "Price is Required" });
      case !category:
        return res.status(500).json({ message: "Category is Required" });
      case !quantity:
        return res.status(500).json({ message: "Quantity is Required" });
      case image && image.size > 1048576:
        return res
          .status(500)
          .json({ message: "image is Required and should be less then 1mb" });
    }

    const product = await Productmodel.findByIdAndUpdate(
      req.params.id,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (image) {
      product.image.data = fs.readFileSync(image.path);
      product.image.contentType = image.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while updating product",
      error,
    });
  }
};

// getting all products
const gettingProductController = async (req, res) => {
  try {
    const product = await Productmodel.find({})
      .select("-image")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      totalProduct: product.length,
      message: "Successfully fetched all products",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while getting all product",
      error,
    });
  }
};

// getting single product
const singleProductController = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Productmodel.findOne({ slug })
      .select("-image")
      .populate("category");
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "product not found" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "found the product", product });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error while fetching the product",
      error,
    });
  }
};

// fetching product picture
const productImageController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await Productmodel.findById(pid).select("image");
    if (product.image.data) {
      res.set("Content-type", product.image.contentType);
      return res.status(200).send(product.image.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching the product image",
    });
  }
};

// route for deleting product
const deleteProductController = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Productmodel.findByIdAndDelete(id).select("-image");
    res
      .status(200)
      .json({ success: true, message: "Successfully deleted the product" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

// filter product controller
const filterProductController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length > 0) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Productmodel.find(args);
    if (products) {
      res.status(200).json({ success: true, products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while filtering product",
      error,
    });
  }
};

// product count controller
const productCountController = async (req, res) => {
  try {
    const total = await Productmodel.find({}).estimatedDocumentCount();
    res.status(200).json({
      success: true,
      message: "Successfully counted documents",
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while product count",
      error,
    });
  }
};

// product per page
const productListController = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await Productmodel.find({})
      .select("image")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in per page count",
      error,
    });
  }
};

// search product
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const product = await Productmodel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-image");
    if (product) {
      res.status(200).json({
        success: true,
        message: "Succesfully product fetched ",
        product,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

// route for showing relatable product
const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await Productmodel.find({
      category: cid,
      _id: { $ne: pid },
    })
      .select("-image")
      .limit(1)
      .populate("category");
    if (products) {
      console.log(products);
      res
        .status(200)
        .json({ success: true, message: "Found products", products });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

// route for category wise product
const productCategoryController = async (req, res) => {
  try {
    const category = await Categorymodel.findOne({ slug: req.params.slug });
    const products = await Productmodel.find({ category });
    if (products) {
      res.status(200).json({
        success: true,
        message: "successfully imported products",
        category,
        products,
      });
    }
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
  createProductController,
  updateProductController,
  gettingProductController,
  singleProductController,
  deleteProductController,
  productImageController,
  filterProductController,
  searchProductController,
  relatedProductController,
  productCategoryController,
};
