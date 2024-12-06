const jwt = require("jsonwebtoken");
const userModel = require("../models/Usermodel");

// protecting routes which are accessable only after login with the help of auth token

const requireSignIn = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.headers.authorization, process.env.JWT_SIGN);

    req.user = decode;
    console.log("decode value is ", decode);
    // console.log("decode value is ", req.user.id);
    next();
  } catch (error) {
    console.log(error);
  }
};

// middleware function for admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user.id);

    // console.log("user ", user.user);
    if (user.role !== 1) {
      return res.status(401).json({ success: false });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error occured while validating admin",
    });
  }
};
module.exports = { requireSignIn, isAdmin };
