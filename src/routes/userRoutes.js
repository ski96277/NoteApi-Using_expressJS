const express = require("express");
const {
  signin,
  signup,
  updateProfile,
  sentOTP,
  changePassword,
  forgotPassword,
} = require("../controllers/userController");
const auth = require("../middlewares/auth");
const emailRequestLimiter = require("../middlewares/email_rate_limit");

const userRoutes = express.Router();
userRoutes.use(emailRequestLimiter);

userRoutes.post("/sigin", signin);

userRoutes.post("/signup", signup);
userRoutes.put("/update-profile", auth, updateProfile);
userRoutes.get("/sent-otp", auth, sentOTP);
userRoutes.post("/change-password", auth, changePassword);
userRoutes.post("/forgot-password", auth, forgotPassword);

module.exports = userRoutes;
