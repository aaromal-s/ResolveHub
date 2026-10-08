const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    default: 'general',
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  readAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// MongoDB TTL index: automatically delete notification 24 hours after it's been read
NotificationSchema.index({ readAt: 1 }, { expireAfterSeconds: 86400, partialFilterExpression: { readAt: { $type: 'date' } } });

module.exports = mongoose.model('Notification', NotificationSchema);
