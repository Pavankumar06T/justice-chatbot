const { generateResponse } = require('../services/geminiService');
const Chat = require('../models/Chat');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get chat history
// @route   GET /api/v1/chat/history
// @access  Private
exports.getChatHistory = asyncHandler(async (req, res, next) => {
  const chats = await Chat.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json({
    success: true,
    count: chats.length,
    data: chats
  });
});

// @desc    Send message to chatbot
// @route   POST /api/v1/chat/send
// @access  Private
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorResponse('Please provide a message', 400));
  }

  // Get AI response
  const aiResponse = await generateResponse(message);

  // Save to database
  const chat = await Chat.create({
    user: req.user.id,
    userMessage: message,
    aiResponse: aiResponse
  });

  res.status(200).json({
    success: true,
    data: chat
  });
});

// @desc    Clear chat history
// @route   DELETE /api/v1/chat/clear
// @access  Private
exports.clearChatHistory = asyncHandler(async (req, res, next) => {
  await Chat.deleteMany({ user: req.user.id });
  res.status(200).json({
    success: true,
    data: {}
  });
});