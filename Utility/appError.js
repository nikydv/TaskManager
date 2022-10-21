class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.success = `${statusCode}`.startsWith("4") ? false : true;
    this.isOperational = true;
    Error.captureStackTrace(this, this.consttructor);
  }
}

module.exports = AppError;
