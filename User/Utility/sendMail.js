const sendMail = require('./eMail');
const getToken = require('./token')

exports.mailToUser = async (req, res) => 
{
       const otp = parseInt(Math.random() * 100000);
       const sub = 'Otp for LogIn to TskMgr is:'
       const msg = "<p> Dear User, </p>"+
       "<p>OTP for account verification is: <br/>" + 
       "<span style='font-weight:bold;color: green'>" + otp + "</span>" +
       "<br/> Pls use this before it gets expired. </p>" +
       "<p> Thanks and Regards,<br/>" +
       " TskMgr Team </p>"
   
       await sendMail({
           email: req.user.email,
           subject: sub,
           message: msg
       })

    const token = getToken.signToken({otp: otp, id: req.user._id});
    const cookieOptions = {
        expires: new Date(Date.now() + 5 * 60 * 1000),
        httpOnly: false
    };

    res.cookie('otp', token, cookieOptions);
       res.status(200).json({
           status: 'success',
           message: `OTP sent to mail ${req.body.email}`
       }) 
}
