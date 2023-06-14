const { body, validationResult } = require("express-validator");
const { hashPassword, comparePassword } = require("../helper/authHelper");
const userModel = require("../models/Usermodel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// confiq env so we can use environment varriables
dotenv.config();

// registration controller
const registerController = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    // first method for validation of value provided by the user in the backend
    [
      body("name", "name must not be empty").isLength({ min: 10, max: 20 }),
      body("email", "enter a valid email address").isEmail().isLength({
        min: 10,
        max: 20,
      }),
      body("password", "password length must be more than 5 ").isLength({
        min: 5,
      }),
      body("phone", "phone number must be valid").isLength({
        min: 10,
        max: 10,
      }),
      body("address", "address must not be empty").isLength({ min: 10 }),
    ];

    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: "provide proper details" });
    }
    // second method for validation of value provided by the user in the backend
    // if (!name || !email || !password || !phone || !address) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "provide proper details to register",
    //   });
    // }

    // searching the user in database
    const userExixt = await userModel.findOne({ email });
    if (userExixt) {
      res.status(200).json({
        success: false,
        message: "user with this email address already exixts",
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

// login controller

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    [
      body("email", "enter a valid email address").isEmail(),
      body("password", "password length must be more than 5 ").exists(),
    ];
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
      },
      authtoken,
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
module.exports = { registerController, loginController, testController };
