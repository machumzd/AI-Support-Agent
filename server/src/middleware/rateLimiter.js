const rateLimit = require('express-rate-limit');
const config = require('../config/env');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { message: 'Too many requests, please slow down' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.authMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { message: 'Too many login/signup attempts. Please try again after 15 minutes' }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.rateLimit.chatMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: { message: 'Message rate limit exceeded. Please wait a moment before sending another message' }
});

module.exports = {
  apiLimiter,
  authLimiter,
  chatLimiter
};
