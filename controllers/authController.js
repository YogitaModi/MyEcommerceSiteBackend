const { hashPassword, comparePassword } = require("../helper/authHelper");
const userModel = require("../models/Usermodel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const OrderModel = require("../models/OrderModel");
const Usermodel = require("../models/Usermodel");

// confiq env so we can use environment varriables
dotenv.config();

// registration controller
const registerController = async (req, res) => {
  const { name, email, password, phone, address, answer } = req.body;
  try {
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "provide proper details to register",
      });
    }
    if (email.length < 10) {
      return res.status(400).json({
        success: false,
        message: "provide proper details to register",
      });
    }
    if (phone.length < 10) {
      return res.status(400).json({
        success: false,
        message: "provide proper details to register",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "provide proper details to register",
      });
    }
    if (!address) {
      return res.status(400).json({
        success: false,
        message: "provide proper details to register",
      });
    }
    if (!answer) {
      return res.status(400).json({
        success: false,
        message: "provide proper details to register",
      });
    }

    // searching the user in database
    const userExixt = await userModel.findOne({ email });
    if (userExixt) {
      res.status(200).json({
        success: false,
        message: "user with this email address already exists",
      });
    }

    // hashing the password
    const hashpassword = await hashPassword(password);

    // creating new user
    const newUser = await new userModel({
      name,
      email,
      address,
      phone,
      password: hashpassword,
      answer,
    }).save();

    const authtoken = jwt.sign({ id: newUser._id }, process.env.JWT_SIGN);
    console.log(authtoken);
    res.status(201).json({
      success: true,
      message: "new user registered successfully",
      authtoken,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "error in registration", error });
  }
};
// forgot password controller
const forgotpasswordcontroller = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "email is required" });
    }
    if (!newPassword) {
      res
        .status(400)
        .json({ success: false, message: "newPassword is required" });
    }
    if (!answer) {
      res.status(400).json({ success: false, message: "answer is required" });
    }

    // checking the user in database
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "provide correct email or answer" });
    }
    const hashing = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashing });
    res
      .status(200)
      .json({ success: true, message: "password updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "something went wrong", error });
  }
};
// login controller

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findUser = await userModel.findOne({ email });

    //   user does not exist
    if (!findUser) {
      return res
        .status(400)
        .json({ success: false, message: "provide correct credentials" });
    }

    //   if user with this email address exixts then check the password
    const passwordCompairing = await comparePassword(
      password,
      findUser.password
    );
    if (!passwordCompairing) {
      return res
        .status(400)
        .json({ success: false, message: "provide correct credentials" });
    }

    const authtoken = jwt.sign({ id: findUser._id }, process.env.JWT_SIGN);
    res.status(200).json({
      success: true,
      message: "Successfully logged in ",
      user: {
        name: findUser.name,
        email: findUser.email,
        phone: findUser.phone,
        address: findUser.address,
        role: findUser.role,
      },
      authtoken: authtoken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "error in login", error });
  }
};

// test controller
const testController = async (req, res) => {
  res.send("protected routes");
};

// update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    const user = await userModel.findById(req.user.id);

    if (password && password.length < 9) {
      res.json({ success: false, message: "password is required" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updateUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "Successfully Updated User Profile",
      updateUser: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while updating user profile",
      error,
    });
  }
};

// get orders end point require sign in
const getOrdersController = async (req, res) => {
  try {
    const Orders = await OrderModel.find({ buyer: req.user.id })
      .populate("products", "-image")
      .populate("buyer");

    res.status(200).json(Orders);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while getting user orders",
      error,
    });
  }
};

// get all orders in admin pannel
const getAllOrdersController = async (req, res) => {
  try {
    const orders = await OrderModel.find({})
      .populate("products", "-image")
      .populate("buyer")
      .sort({ createdAt: "-1" });
    if (orders) {
      res.status(200).json({
        success: true,
        message: "fetched all orders successfully",
        orders,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all orders",
      error,
    });
  }
};

// status updating route
const statusUpdateController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while updating order status",
      error,
    });
  }
};

// all user routes
const allUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password")
      .select("-answer")
      .sort({ createdAt: "-1" });
    if (users) {
      res.status(200).json({
        success: true,
        message: "all users fetched successfully",
        users,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while fetching users",
      error,
    });
  }
};

// product quantity controller
// const productQuantityController = async (req, res) => {
//   try {
//     const { pid, oid } = req.params;
//     const { quantity } = req.body;
//     const order = await OrderModel.find({ products: pid });
//     if (order) {
//       order.orderQauntity = quantity;
//     }
//     const updateOrder = await OrderModel.findByIdAndUpdate(
//       oid,
//       { orderQauntity: quantity },
//       { new: true }
//     );
//     res.json(updateOrder);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Error while updating order quantity",
//       error,
//     });
//   }
// };

module.exports = {
  registerController,
  loginController,
  testController,
  forgotpasswordcontroller,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  statusUpdateController,
  allUsersController,
};
