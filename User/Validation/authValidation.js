const appError = require('../../Utility/appError');
const User = require('../userModel');
const { mailToUser } = require('../Utility/sendMail')
const { createSendToken } = require('../Utility/token')

exports.logIn = async(req, res, next) => {

        const { email, password } = req.body;
        // console.log("Received body: ", req.body)

       //1. Check if id nd pass exist
       if(!email || !password)
       {
          return next(new appError('Pls provide email and password', 400));
       }
    
       //2. Check if id and password exists in Database:
       const user = await User.findOne({ email }).select('+password');
       //console.log("User in DB: ", user);

       if(!user || !(await user.correctPassword(password, user.password)))
       {
           return next(new appError('Incorrect email or password', 400));
       }
    
       //3. if all ok send OTP to mail and OTP-token to client:
       return new Promise((resolve)=>resolve(user));
}