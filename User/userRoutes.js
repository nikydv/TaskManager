const express = require('express')
const userController = require('./userController');

const router = express.Router();

router
  .route('/signUp')
  .post(userController.userSignUp);

router
  .route('/logIn')
  .post(userController.userLogIn); 

router
  .route('/verify') 
  .post(userController.verifyUserOtp) 
  
router
  .route('/logOut')
  .get(userController.logOut);   

module.exports = router;  

