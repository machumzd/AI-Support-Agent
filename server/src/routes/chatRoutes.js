const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  clearChatHistory
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiter');

// All chat routes are protected by JWT authentication
router.use(protect);

// Send message to AI
router.post('/send', chatLimiter, sendMessage);

// Get chat history
router.get('/history', getChatHistory);

// Clear chat history
router.delete('/history', clearChatHistory);

module.exports = router;
