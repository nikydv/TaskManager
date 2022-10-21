const AppError = require('./appError')

const sendErrorProd = (err, req, res) => {
  return res.status(err.statusCode).send({
    success: err.status,
    message: err.message,
    result: [],
  });
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || false;
  if (error.name === 'ValidationError'){
    error = handleValidationErrorDB(error);
  }
  sendErrorProd(error, req, res);
};
