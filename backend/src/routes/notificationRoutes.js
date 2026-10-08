const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  broadcastNotification,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.post('/broadcast', protect, admin, broadcastNotification);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id', protect, markAsRead);

module.exports = router;

