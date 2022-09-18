const User = require('../Models/userModel');
const appError = require('../Utility/appError');
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sendMail = require('../Utility/eMail');



const signToken = id => {
    return jwt.sign(id, 'Secret-key-must-be-secret');
}

const createSendToken = (id, statusCode, res) =>
{
    const token = signToken({id: id});
    //const time = Date.now() + process.env.JWT_Cookie_ExpiresIn * 24 * 60 * 60 * 1000;
    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 60 * 1000),
        httpOnly: true
    };

    res.cookie('jwt', token, cookieOptions);

    res.status(statusCode).json({
        status: 'success',
        token
    });
};


exports.isLoggedIn = async (req, res, next) => {
    try 
    {
        if (req.cookies.jwt) 
        {
            // 1) verify token:
            const decoded = await promisify(jwt.verify)(
              req.cookies.jwt,
              'Secret-key-must-be-secret'
            );
      
            // 2) Check if user still exists
            console.log('Decoded in LoggedIn: ', decoded);
            const currentUser = await User.findById(decoded.id.id);
            if (!currentUser) {
              return next( new appError('No user find for this token! pls logIn again.', 404));
            }
              
            //3) THERE IS A LOGGED IN USER
            console.log("LoggedIn User: ", currentUser);
            req.user = currentUser;
            return next();  

        }else{
            next(new appError('Pls LogIn first, to perform this action', 404));
        }

    } catch (error) 
    {
        console.log('Errror in isLoggedIn User: ', error);
        next(new appError('Pls LogIn first!', 404));
    }
    
};



exports.signUp = async (req, res, next) => {
    try 
    {
        console.log(req.body);
        const newUser = await User.create(req.body);
        // res.status(200).send({
        //     status: 'success',
        //     data: { newUser }
        // })
        createSendToken(newUser, 202, res)

    } catch (error) 
    {
        console.log("Error in signUp: ", error.stack);
        next(new appError('Getting error while signingUp', 404))
    }
}

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

const mailToUser = async (req, res) => 
{
       const otp = parseInt(Math.random() * 100000);
       const sub = 'Otp for LogIn to TskMgr is:'
       //const msg = `Dear User, Your OTP is: ${otp}. pls use this to complete your logIn.`
       const msg = "<p> Dear User, </p>"+
       "<p>OTP for account verification is: <br/>" + 
       "<span style='font-weight:bold;color: green'>" + otp + "</span>" +
       "<br/> Pls use this before it gets expired. </p>" +
       "<p> Thanks and Regards,<br/>" +
       " TskMgr Team </p>"
   
       await sendMail({
           email: 'nik@yadu.com',
           subject: sub,
           message: msg
       })

    const token = signToken({otp: otp, id: req.user._id});
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 60 * 1000),
        httpOnly: true
    };

    res.cookie('otp', token, cookieOptions);
       res.status(200).json({
           status: 'success',
           message: `OTP sent to mail ${req.body.email}`
       }) 
}



exports.verifyOtp = async(req, res, next) => {
    try 
    {
        //const { otp } = req.body;
        console.log("Received otp: ", req.body.otp)

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

      console.log('Decoded in verify: ', decoded.id)
       if(decoded.otp == req.body.otp)
       {
        console.log('user: ', decoded.id);
        res.cookie('otp', '', 
           {
            expires: new Date(Date.now()),
            httpOnly: true
          });
         createSendToken(decoded, 200, res);
       }      

    } catch (error) 
    {
        console.log("Error in LogIn: ", error)
        next(new appError('Something wrong while logginIn', 400));
    }
}



exports.logOut = async(req, res, next) => {
    try 
    {
        res.cookie('jwt', 'loggedout', 
           {
            expires: new Date(Date.now() + 3 * 1000),
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

