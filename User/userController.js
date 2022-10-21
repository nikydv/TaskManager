const User = require("./userModel");
const jwt = require("jsonwebtoken");
const { mailToUser } = require("./Utility/sendMail");
const { createSendToken } = require("./Utility/token");
const {
  logIn,
  verifyOtp,
  signUp,
  logOut,
} = require("./Validation/authValidation");
const { throws } = require("assert");
const AppError = require("../Utility/appError");

exports.signUp = (req, res, next) => {
  signUp(req, res)
    .then((data) => {
      User.create(req.body, {
        new: true,
        runValidators: true,
      })
        .then((newUser) => {
          req.user = newUser;
          mailToUser(req, res);
        })
        .catch((err) => next(new AppError(err, 404)));
    })
    .catch((err) => next(new AppError(err, 404)));
};

exports.logIn = (req, res, next) => {
  logIn(req, res, next)
    .then((user) => {
      req.user = user;
      mailToUser(req, res);
    })
    .catch((err) => next(new AppError(err, 400)));
};

exports.verifyOtp = (req, res, next) => {
  verifyOtp(req, res)
    .then((decoded) => {
      res.cookie("otp", "", {
        expires: new Date(Date.now()),
        httpOnly: false,
      });
      createSendToken(decoded, 200, res);
    })
    .catch((err) => next(new AppError(err, 400)));
};

exports.logOut = (req, res, next) => {
  logOut(req, res)
    .then(() => {
      res.status(200).send({
        success: true,
        message: "Logged Out SuccessFully",
        result: [],
      });
    })
    .catch((err) => next(new AppError(err, 400)));
};
