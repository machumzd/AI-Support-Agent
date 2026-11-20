const ChatMessage = require('../models/ChatMessage');
const { generateSupportResponse } = require('../services/aiService');

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const trimmed = message.trim();

    // Persist incoming user query
    const userMsg = await ChatMessage.create({
      userId: req.user._id,
      role: 'user',
      content: trimmed
    });

    // Fetch recent dialogue turns to give the model conversation context
    const recentHistory = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    const chronologicalHistory = recentHistory.reverse();

    // Call AI provider
    const aiResult = await generateSupportResponse(trimmed, chronologicalHistory);

    // Persist assistant reply
    const assistantMsg = await ChatMessage.create({
      userId: req.user._id,
      role: 'assistant',
      content: aiResult.content,
      model: aiResult.model
    });

    return res.status(200).json({
      userMessage: userMsg,
      assistantMessage: assistantMsg
    });
  } catch (err) {
    next(err);
  }
};

const getChatHistory = async (req, res, next) => {
  try {
    const messages = await ChatMessage.find({ userId: req.user._id })
      .sort({ createdAt: 1 })
      .lean();

    return res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

const clearChatHistory = async (req, res, next) => {
  try {
    await ChatMessage.deleteMany({ userId: req.user._id });
    return res.status(200).json({ message: 'Chat history cleared' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  clearChatHistory
};
