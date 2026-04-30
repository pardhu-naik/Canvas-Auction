const Review = require('../models/Review');

// @desc    Get reviews for an artwork
// @route   GET /api/reviews/:artworkId
// @access  Public
const getReviewsByArtwork = async (req, res, next) => {
  try {
    const reviews = await Review.find({ artwork: req.params.artworkId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { artworkId, rating, comment } = req.body;

    const existingReview = await Review.findOne({
      user: req.user._id,
      artwork: artworkId,
    });

    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this artwork');
    }

    const review = await Review.create({
      user: req.user._id,
      artwork: artworkId,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('Not authorized to delete this review');
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getReviewsByArtwork, createReview, deleteReview };
