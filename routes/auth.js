const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
  testController,
  forgotpasswordcontroller,
} = require("../controllers/authController");
const { requireSignIn, isAdmin } = require("../middleware/authMiddleware");

// end point for creating new user using post method :"/api/v1/auth/register"

router.post(
  "/register",

  registerController
);

// end point for login user using post method :"/api/v1/auth/login"
router.post(
  "/userlogin",

  loginController
);

//end point forgot password for login :"/api/v1/auth"
router.post("/forgot-password", forgotpasswordcontroller);

// end point for testing user using get method :"/api/v1/auth/test"
router.get("/test", requireSignIn, isAdmin, testController);

// end point for fetching user specific data after user login using get method :"/api/v1/auth/user-auth"

router.get("/user-auth", requireSignIn, async (req, res) => {
  res.status(200).json({ success: true });
});
// end point for fetching admin specific data after user login using get method :"/api/v1/auth/user-auth"

router.get("/admin-auth", requireSignIn, isAdmin, async (req, res) => {
  res.status(200).json({ success: true });
});
module.exports = router;
