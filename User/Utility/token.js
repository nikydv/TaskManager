const jwt = require('jsonwebtoken');

signToken = id => {
    return jwt.sign(id, 'Secret-key-must-be-secret');
}

createSendToken = (id, statusCode, res) => {
    const token = signToken({id: id});
    const cookieOptions = {
        expires: new Date(Date.now() + 10 * 60 * 1000),
        httpOnly: false
    };
    res.cookie('jwt', token, cookieOptions);
    res.status(statusCode).json({
        status: 'success',
        token
    });
};

module.exports = {signToken, createSendToken}