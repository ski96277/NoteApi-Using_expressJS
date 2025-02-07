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
const rateLimit = require("express-rate-limit");
let limit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  message: { message: "Too many requests, please try again 15 minutes later." },
});
const userRoutes = express.Router();
userRoutes.use(limit);

userRoutes.post("/sigin", signin);

userRoutes.post("/signup", signup);
userRoutes.put("/update-profile", auth, updateProfile);
userRoutes.get("/sent-otp", auth, sentOTP);
userRoutes.post("/change-password", auth, changePassword);
userRoutes.post("/forgot-password", auth, forgotPassword);

module.exports = userRoutes;
