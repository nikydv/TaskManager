const appError = require("../../Utility/appError");
const { promisify } = require("util");
const User = require("../userModel");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    // 1) verify token:
    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      "Secret-key-must-be-secret"
    );
    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id.id);
    if (!currentUser) {
      return next(
        new appError("No user find for this token! pls logIn again.", 404)
      );
    } else {
      //3) THERE IS A LOGGED IN USER
      req.user = currentUser;
      return next();
    }
  } else {
    next(new appError("Pls LogIn first, to perform this action", 404));
  }
};

