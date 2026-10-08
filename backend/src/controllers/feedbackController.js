const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

// @desc    Submit feedback/rating for a resolved/closed complaint
// @route   POST /api/feedback
// @access  Private
const submitFeedback = async (req, res, next) => {
  try {
    const { complaintId, rating, comment } = req.body;

    if (!complaintId || !rating) {
      res.statusCode = 400;
      throw new Error('Please enter complaint ID and rating');
    }

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      res.statusCode = 404;
      throw new Error('Complaint not found');
    }

    // Auth check
    if (complaint.userId.toString() !== req.user._id.toString()) {
      res.statusCode = 403;
      throw new Error('Not authorized to give feedback for this complaint');
    }

    // Must be resolved or closed
    if (complaint.status !== 'Resolved' && complaint.status !== 'Closed') {
      res.statusCode = 400;
      throw new Error('Feedback can only be submitted for Resolved or Closed complaints');
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ complaintId });
    if (existingFeedback) {
      res.statusCode = 400;
      throw new Error('Feedback has already been submitted for this complaint');
    }

    const feedback = await Feedback.create({
      complaintId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
};
