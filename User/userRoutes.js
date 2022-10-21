const express = require("express");
const userController = require("./userController");

const router = express.Router();

router.route("/signUp").post(userController.signUp);

router.route("/logIn").post(userController.logIn);

router.route("/verify").post(userController.verifyOtp);

router.route("/logOut").get(userController.logOut);

module.exports = router;
