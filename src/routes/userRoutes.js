const express = require("express");
const { signin, signup } = require("../controllers/userController");

const userRoutes = express.Router();


userRoutes.post("/sigin",signin)

userRoutes.post("/signup",signup)


module.exports = userRoutes;