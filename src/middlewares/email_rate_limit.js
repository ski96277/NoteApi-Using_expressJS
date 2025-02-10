//set request limit from a device
const rateLimit = require("express-rate-limit");

const emailRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 24 hours
  max: 5, // Limit each email to 5 requests per day
  keyGenerator: (req) => req.body.email || req.query.email, // Identify users by email
  message: "You have exceeded the daily request limit for this email.",
  statusCode: 429, // Too many requests
  handler: (req, res) => {
    res.status(429).json({
      error: "You have exceeded the daily request limit for this email.",
    });
  },
});

module.exports = emailRequestLimiter;
