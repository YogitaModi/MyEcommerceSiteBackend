// const { body, validationResult } = require("express-validator");
const { hashPassword } = require("../helper/authHelper");
const userModel = require("../models/Usermodel");

const registerController = async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  try {
    if (!name || !email || !password || !phone || !address) {
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
    res.status(201).json({
      success: true,
      message: "new user registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "error in registration", error });
  }
};
module.exports = registerController;
