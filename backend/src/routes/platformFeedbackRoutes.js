const express = require('express');
const router = express.Router();
const {
  getPlatformFeedbacks,
  createPlatformFeedback,
} = require('../controllers/platformFeedbackController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getPlatformFeedbacks);
router.post('/', protect, createPlatformFeedback);

module.exports = router;
