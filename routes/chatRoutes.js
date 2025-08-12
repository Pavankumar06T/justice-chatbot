const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getChatHistory,
  sendMessage,
  clearChatHistory
} = require('../controllers/chatController');

router.route('/history').get(protect, getChatHistory);
router.route('/send').post(protect, sendMessage);
router.route('/clear').delete(protect, clearChatHistory);

module.exports = router;