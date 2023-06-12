// /const userSchema = require("../models/Usermodel");
const express = require("express");
const router = express.Router();
// const { body, validationResult } = require("express-validator");
const registerController = require("../controllers/authController");

// end point for creating new user using post method :"/api/v1/auth/register"

router.post("/register", registerController);
module.exports = router;
