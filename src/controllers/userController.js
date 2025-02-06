const userModel = require("../models/user");
const otpModel = require("../models/otp");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET_KEY;

const signup = async (req, res) => {
  //check exiting user
  const { username, email, password } = req.body;
  try {
    const exitingUser = await userModel.findOne({ email: email });
    if (exitingUser) {
      return res.status(200).json({ message: "User already exists" });
    }

    //Hashed Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //User creation
    const result = await userModel.create({
      email: email,
      password: hashedPassword,
      userName: username,
    });
    console.log("result = " + result);

    // Token Generate
    const token = jwt.sign({ email: result.email, id: result._id }, SECRET);
    return res.status(201).json({ user: result, token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something wen wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const exitingUser = await userModel.findOne({ email: email });
    if (!exitingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, exitingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: exitingUser.email, id: exitingUser._id },
      SECRET
    );
    return res.status(200).json({ user: exitingUser, token: token });
  } catch (error) {
    console.log("got error on login " + error);
    return res.status(500).json({ message: "Email login got an error" });
  }
};
//update user name
const updateProfile = async (req, res) => {
  const { username } = req.body;
  const userId = req.userId;
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { userName: username },
      { new: true }
    );
    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.log("got error on update profile " + error);
    return res.status(500).json({ message: "Update profile got an error" });
  }
};

const sentOTP = async (req, res) => {
  const userId = req.userId;
  console.log("user id = " + userId);

  const number = Math.floor(1000 + Math.random() * 9000);

  //if already have some otp collection for this user delete it

  try {
    await otpModel.deleteMany({ userId: userId });
    console.log("Previous OTP collection are deleted");
  } catch (error) {
    console.log("Previous OTP collection are not deleted error is " + error);
  }

  try {
    const result = await otpModel.create({
      otp: number,
      userId: userId,
      used: false,
    });
    if (result) {
      return res.status(201).json({
        message: "4 digits number generated success",
      });
    } else {
      return res.status(500).json({
        message: "4 digits number generated failed",
      });
    }
  } catch (error) {
    console.log("Error message creation 4 digits =" + error);
    return res.status(404).json({ message: error });
  }
};

//Change Password
const changePassword = async (req, res) => {
  const { oldPassword, newPassword, otp } = req.body;
  const userId = req.userId;
  console.log(
    "user id " +
      userId +
      " old password " +
      oldPassword +
      " new password " +
      newPassword
  );

  //get otp information
  let otpInformation;

  try {
    otpInformation = await otpModel.findOne({ userId: userId, used: false });

    if (otpInformation.used) {
      return res.status(400).json({ message: "OTP already used" });
    }

    if (parseInt(otp) !== otpInformation.otp) {
      return res.status(400).json({ message: "OTP doesn't match" });
    }
  } catch (error) {
    return res.status(400).json({ message: "No active OTP found" });
  }
  //get user information
  const userInformation = await userModel.findOne({ _id: userId });
  const passwordCompare = await bcrypt.compare(
    oldPassword,
    userInformation.password
  );

  if (!passwordCompare) {
    return res.status(400).json({ message: "Old password doesn't match" });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  //update password
  try {
    await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  } catch (error) {
    console.log("got error on password update " + error);
    return res.status(500).json({ message: "Password update got an error" });
  }

  //update otp collection
  try {
    await otpModel.findByIdAndUpdate(
      otpInformation._id,
      {
        used: true,
      },
      { new: true }
    );
  } catch (error) {
    console.log("otp update got an error");
  }

  return res.status(200).json({ message: "Password updated." });
};

//forgot password
const forgotPassword = async (req, res) => {
  const userId = req.userId;
  const { email, otp, password } = req.body;
  let otpInformation;
  //OTP validation check
  try {
    otpInformation = await otpModel.findOne({ userId: userId, used: false });

    if (!otpInformation) {
      return res.status(400).json({ message: "No OTP found for this user" });
    }

    if (parseInt(otp) !== otpInformation.otp) {
      return res.status(400).json({ message: "OTP does not match" });
    }
  } catch (error) {
    console.log("otp fetch and match got an error " + error);
    return res.status(400).json({ message: "No OTP found for this user" });
  }

  //get user information
  let userInformation;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userInformation = await userModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
    if (!userInformation) {
      res.status(400).json({ message: "password update got an error" });
    }
  } catch (error) {
    return res.status(400).json({ message: "password update got an error" });
  }
  //update otp collection
  try {
    await otpModel.findByIdAndUpdate(
      otpInformation._id,
      {
        used: true,
      },
      { new: true }
    );
  } catch (error) {
    console.log("otp update got an error");
  }

  res.status(200).json({message: "Password update complete"})
};

module.exports = { signin, signup, updateProfile, sentOTP, changePassword,forgotPassword };
