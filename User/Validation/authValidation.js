const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../userModel");

exports.signUp = (req, res) => {
  return new Promise((resolve, reject) => {
    User.find({ email: req.body.email })
      .then((checkUser) => {
        if (checkUser.length == 0) {
          resolve(req.body);
        } else {
          reject(
            `User already exist with the email: ${req.body.email}, pls use another email`
          );
        }
      })
      .catch((err) => reject(err));
  });
};

exports.logIn = (req, res) => {
  return new Promise((resolve, reject) => {
    const { email, password } = req.body;
    //1. Check if id nd pass exist
    if (!email || !password) {
      reject("Pls provide email and password");
    } else {
      User.findOne({ email })
        .select("+password")
        .then(async (user) => {
          //2. Check if id and password exists in Database:
          if (!user || !(await user.correctPassword(password, user.password))) {
            reject("Incorrect email or password");
          } else {
            //3. if all ok send OTP to mail and OTP-token to client:
            resolve(user);
          }
        })
        .catch((err) => reject(err));
    }
  });
};

exports.verifyOtp = (req, res) => {
  return new Promise((resolve, reject) => {
    if (req.cookies.otp) {
      if (req.body.otp) {
        //1. Verify OTP :
        promisify(jwt.verify)(req.cookies.otp, "Secret-key-must-be-secret")
          .then((decoded) => {
            if (decoded.otp == req.body.otp) {
              resolve(decoded);
            } else {
              reject("Wrong OTP, Pls provide correct one!");
            }
          })
          .catch((err) => reject(err));
      } else {
        //2. Check if OTP exists:
        reject("Pls provide OTP!");
      }
    } else {
      //3. Check if token exists
      reject("OTP expired pls get another!");
    }
  });
};

exports.logOut = (req, res) => {
  return new Promise((resolve, reject) => {
    res.cookie("jwt", "loggedout", {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    resolve(true);
  });
};
