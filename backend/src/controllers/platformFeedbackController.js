const PlatformFeedback = require('../models/PlatformFeedback');

// @desc    Get all platform feedbacks (public for landing page)
// @route   GET /api/platform-feedback
// @access  Public
const getPlatformFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await PlatformFeedback.find({})
      .populate('user', 'name role avatar')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      count: feedbacks.length,
      feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit platform feedback
// @route   POST /api/platform-feedback
// @access  Private
const createPlatformFeedback = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!comment || !comment.trim()) {
      res.statusCode = 400;
      throw new Error('Please enter a feedback comment');
    }

    const feedback = await PlatformFeedback.create({
      user: req.user ? req.user._id : null,
      rating: Number(rating) || 5,
      comment: comment.trim(),
    });

    await feedback.populate('user', 'name role avatar');

    res.status(201).json({
      success: true,
      message: 'Thank you for your feedback!',
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformFeedbacks,
  createPlatformFeedback,
};
