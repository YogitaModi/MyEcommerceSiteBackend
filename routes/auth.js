const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  testController,
} = require("../controllers/authController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// end point for creating new user using post method :"/api/v1/auth/register"

router.post("/register", registerController);

// end point for login user using post method :"/api/v1/auth/login"
router.post("/userlogin", loginController);

// end point for testing user using post method :"/api/v1/auth/login"
router.get("/test", authMiddleware, isAdmin, testController);
module.exports = router;
