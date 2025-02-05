const express = require("express");
const { signin, signup, updateProfile, sentOTP, changePassword } = require("../controllers/userController");
const auth = require("../middlewares/auth");

const userRoutes = express.Router();


userRoutes.post("/sigin",signin);

userRoutes.post("/signup",signup);
userRoutes.put("/update-profile",auth,updateProfile);
userRoutes.get("/sent-otp",auth,sentOTP);
userRoutes.post("/change-password",auth,changePassword)


module.exports = userRoutes;