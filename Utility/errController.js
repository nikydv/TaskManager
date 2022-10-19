
const sendErrorProd = (err, req, res) => {
  return res.status(err.statusCode).send({
      status: err.status,
      message: err.message
  });
}

module.exports = (error, req, res, next)=>{
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  sendErrorProd(error, req, res);
}

