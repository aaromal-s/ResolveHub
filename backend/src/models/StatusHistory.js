const mongoose = require('mongoose');

const StatusHistorySchema = new mongoose.Schema({
  complaintId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint',
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    trim: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StatusHistory', StatusHistorySchema);
