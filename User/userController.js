const User = require('./userModel');
const appError = require('../Utility/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { mailToUser } = require('./Utility/sendMail')
const { createSendToken } = require('./Utility/token')
const { logIn, verifyOtp, signUp } = require('./Validation/authValidation');
const { throws } = require('assert');
const AppError = require('../Utility/appError');


exports.signUp = (req, res, next)=>{
    try{
        signUp(req, res)
            .then(async (data)=>{
                newUser = await User.create(req.body);
                req.user = newUser; 
                mailToUser(req, res)}, 
            (err)=> next(new AppError(err, 404)))   
    }catch(error){
        console.log("Error in signUp: ", error);
        next(new appError('Getting error while signingUp', 404))
    }
}

exports.logIn = (req, res, next) => {
    try{
        logIn(req, res, next)
          .then( (user)=>{
            req.user = user;
            mailToUser(req, res) }, 
            (err)=> next(new AppError(err, 400)))       
    }catch(error){
        console.log("Error in LogIn: ", error)
        next(new AppError('Something wrong while logginIn', 400));
    }
}

exports.verifyOtp = (req, res, next) => {
    try{
        verifyOtp(req, res)
          .then((decoded)=> {
            res.cookie('otp', '', 
            {
               expires: new Date(Date.now()),
               httpOnly: false
            });
            createSendToken(decoded, 200, res)}, 
            (err)=> next(new AppError(err, 400)))       
    }catch(error){
        console.log("Error in LogIn: ", error)
        next(new AppError('Something wrong while logginIn', 400));
    }
}

exports.logOut = async(req, res, next) => {
    try{
        res.cookie('jwt', 'loggedout', 
           {
            expires: new Date(Date.now()),
            httpOnly: true
          });
        
        res.status(200).send({
            status: 'success',
            Message: 'Logged Out SuccessFully'
        }) 
    }catch(error){
        console.log("Error in LogOut: ", error)
        next(new AppError('Something wrong while logginOut', 400));
    }
}

