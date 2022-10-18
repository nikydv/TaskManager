const User = require('./userModel');
const appError = require('../Utility/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { mailToUser } = require('./Utility/sendMail')
const { createSendToken } = require('./Utility/token')
const { logIn, verifyOtp, signUp } = require('./Validation/authValidation');
const { throws } = require('assert');
const AppError = require('../Utility/appError');


exports.userSignUp = (req, res, next)=>{
    try 
    {
        const data = signUp(req, res, next)
                        .then(async (data)=>
                        {
                            newUser = await User.create(req.body);
                            req.user = newUser; 
                            mailToUser(req, res);           
                        }, 
                        (err)=>next(new AppError(err, 404)))      
        
    } catch (error) 
    {
        console.log("Error in signUp: ", error);
        next(new appError('Getting error while signingUp', 404))
    }
}
/*
exports.signUp = async (req, res, next) => {
    try 
    {
        console.log(req.body);

        const checkUser = await User.find({email: req.body.email})
        //console.log('SignUp user: ', checkUser);

        if(checkUser.length>0)
        {
            return next(new appError(`User already exist with the email: ${req.body.email}, pls use another email`, 404));
        }

        const newUser = await User.create(req.body);
        req.user = newUser;

        mailToUser(req, res);

    } catch (error) 
    {
        console.log("Error in signUp: ", error);
        next(new appError('Getting error while signingUp', 404))
    }
}
*/

exports.userLogIn = (req, res, next) => {
    try 
    {
        logIn(req, res, next).then((user)=>{
            req.user = user;
            mailToUser(req, res);
       })
       
    } catch (error) 
    {
        console.log("Error in LogIn: ", error)
        next(new AppError('Something wrong while logginIn', 400));
    }
}
/*
exports.logIn = async(req, res, next) => {
    try 
    {
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
       req.user = user;
       mailToUser(req, res);

    } catch (error) 
    {
        console.log("Error in LogIn: ", error)
        next(new AppError('Something wrong while logginIn', 400));
    }
}

*/

exports.verifyUserOtp = (req, res, next) => {
    try 
    {
        verifyOtp(req, res, next)
          .then((decoded)=>
          {
            res.cookie('otp', '', 
            {
                expires: new Date(Date.now()),
                httpOnly: false
            });
            createSendToken(decoded, 200, res) 
          })
       
    } catch (error) 
    {
        console.log("Error in LogIn: ", error)
        next(new AppError('Something wrong while logginIn', 400));
    }
}


/*
exports.verifyOtp = async(req, res, next) => {
    try 
    {
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
        res.cookie('otp', '', 
           {
            expires: new Date(Date.now()),
            httpOnly: false
          });
         createSendToken(decoded, 200, res);
       }else
       {
        next(new appError('Wrong OTP, Pls provide correct one!', 400));
       }      

    } catch (error) 
    {
        console.log("Error in LogIn: ", error)
        next(new appError('Something wrong while logginIn', 400));
    }
}
*/



exports.logOut = async(req, res, next) => {
    try 
    {
        res.cookie('jwt', 'loggedout', 
           {
            expires: new Date(Date.now()),
            httpOnly: true
          });
        
        res.status(200).send({
            status: 'success',
            Message: 'Logged Out SuccessFully'
        })  

    } catch (error) 
    {
        console.log("Error in LogOut: ", error)
        next(new AppError('Something wrong while logginOut', 400));
    }
}

