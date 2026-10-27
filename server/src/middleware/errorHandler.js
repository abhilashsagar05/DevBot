const config = require('../config/env');

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function globalErrorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const isProduction = config.nodeEnv === 'production';

  console.error('[SERVER ERROR]', {
    message: err.message,
    statusCode,
    path: req.originalUrl,
    method: req.method,
    stack: isProduction ? undefined : err.stack
  });

  const responseMessage = statusCode === 500 && isProduction
    ? 'An unexpected internal server error occurred. Please try again later.'
    : err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    error: responseMessage
  });
}

module.exports = {
  notFoundHandler,
  globalErrorHandler
};

