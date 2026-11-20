const express = require('express');
const router = express.Router();
const { signup, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// Public auth routes with rate limiting
router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

// Protected user profile route
router.get('/me', protect, getMe);

module.exports = router;
