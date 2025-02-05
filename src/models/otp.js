const mongoose = require("mongoose");

const OTPSchema = mongoose.Schema(
  {
    otp: {
      type: Number,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    used: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("OTP", OTPSchema);
