const ErrorHander = require("./errorhander");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } else {
      return res.status(400).json({ message: "Please login to access these resource" });
    }
    next();
  });
  

exports.authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Assuming you set the user role during authentication
    console.log(req.user._id)

    // Check if the user's role is included in the allowedRoles array
    if (allowedRoles.includes(userRole)) {
      // If the user's role is allowed, continue to the next middleware or route handler
      next();
    } else {
      // If the user's role is not allowed, return an 'unauthorized' response
      return res.status(403).json({ error: 'Unauthorized' });
    }
}
}
 