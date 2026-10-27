const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const chatRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many chat requests from this IP. Please wait a few moments before trying again.'
  },
  skip: (req) => {
    // Skip rate limiting during test executions
    return process.env.NODE_ENV === 'test';
  }
});

module.exports = {
  chatRateLimiter
};

