const AppError = require('./appError')

const sendError = (err, req, res) => {
  return res.status(err.statusCode).send({
    success: err.status,
    message: err.message,
    result: [],
  });
};

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('./ ')}`;
  return new AppError(message, 400);
};

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || false;

  if (error.name === 'CastError'){
    console.log('Cast error caught')
    error = handleCastErrorDB(error);
  } 
  if (error.name === 'ValidationError'){
    error = handleValidationErrorDB(error);
  }
  sendError(error, req, res);
};
