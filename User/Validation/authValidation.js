const appError = require('../../Utility/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../userModel');
const { mailToUser } = require('../Utility/sendMail')
const { createSendToken } = require('../Utility/token')
 

exports.signUp = (req, res) => {
  return new Promise(async (resolve, reject)=>{
    const checkUser = await User.find({email: req.body.email})
    if(checkUser.length>0){
      reject(`User already exist with the email: ${req.body.email}, pls use another email`);
    }
    (resolve)=>resolve(req.body);
  })
}

exports.logIn = (req, res) => {
  return new Promise(async (resolve, reject)=>{
    const { email, password } = req.body;
    //1. Check if id nd pass exist
    if(!email || !password){
      reject('Pls provide email and password');
    }    
    //2. Check if id and password exists in Database:
    const user = await User.findOne({ email }).select('+password');
    if(!user || !(await user.correctPassword(password, user.password))){
      reject('Incorrect email or password');
    }    
    //3. if all ok send OTP to mail and OTP-token to client:
    resolve(user);
  })        
}

exports.verifyOtp = async(req, res) => {
  return new Promise(async (resolve, reject)=>{
    //1. Check if -token exists
    if (!req.cookies.otp){
      return reject('OTP expired pls get another!');
    } 
    //2. Check if OTP exists:
    if(!req.body.otp){
      return reject('Pls provide OTP!');
    } 
    //3. Verify OTP :
    const decoded = await promisify(jwt.verify)(
      req.cookies.otp,
      'Secret-key-must-be-secret'
    );
    if(decoded.otp == req.body.otp){
      return resolve(decoded);     
    }else{
      return reject('Wrong OTP, Pls provide correct one!');
    }
  })      
}