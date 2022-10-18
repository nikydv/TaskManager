const appError = require('../../Utility/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../userModel');
const { mailToUser } = require('../Utility/sendMail')
const { createSendToken } = require('../Utility/token')



exports.signUp = async (req, res, next) => {

        const checkUser = await User.find({email: req.body.email})

        if(checkUser.length>0)
        {
            //return next(new appError(`User already exist with the email: ${req.body.email}, pls use another email`, 404));
            return new Promise((resolve, reject)=>reject(`User already exist with the email: ${req.body.email}, pls use another email`));
        }

        return new Promise((resolve)=>resolve(req.body));
        // const newUser = await User.create(req.body);
        // req.user = newUser;
        // mailToUser(req, res);

}

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


exports.verifyOtp = async(req, res, next) => {

        //const { otp } = req.body;
        //console.log("Received otp: ", req.body.otp)

       //1. Check if -token exists
       if (!req.cookies.otp)
       {
         return next(new appError('OTP expired pls get another!', 400));
       }  

       //2. Check if OTP exists
       if(!req.body.otp)
       {
          return next(new appError('Pls provide OTP!', 400));
       }
    
       //3. Verify OTP :
       const decoded = await promisify(jwt.verify)(
        req.cookies.otp,
        'Secret-key-must-be-secret'
      );

      //console.log('Decoded in verify: ', decoded.id)
       if(decoded.otp == req.body.otp)
       {
        console.log('user: ', decoded.id);
        // res.cookie('otp', '', 
        //    {
        //     expires: new Date(Date.now()),
        //     httpOnly: false
        //   });

          return new Promise((resolve)=>resolve(decoded))
         //createSendToken(decoded, 200, res);
       }else
       {
        next(new appError('Wrong OTP, Pls provide correct one!', 400));
       }      
}