const express = require("express");
const { signin, signup, updateProfile } = require("../controllers/userController");
const auth = require("../middlewares/auth");

const userRoutes = express.Router();


userRoutes.post("/sigin",signin)

userRoutes.post("/signup",signup)
userRoutes.put("/update-profile",auth,updateProfile)


module.exports = userRoutes;