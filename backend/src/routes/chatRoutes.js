const express = require('express');
const router = express.Router();
const { processChat } = require('../controllers/chatController');
const { optionalProtect } = require('../middleware/authMiddleware');

// The route is optionally protected so we can identify the user's role if logged in
router.post('/', optionalProtect, processChat);

module.exports = router;
