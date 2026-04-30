const Wishlist = require('../models/Wishlist');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.find({ user: req.user._id })
      .populate({
        path: 'artwork',
        populate: { path: 'artist', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    next(error);
  }
};

// @desc    Add artwork to wishlist
// @route   POST /api/wishlist
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { artworkId } = req.body;

    const exists = await Wishlist.findOne({ user: req.user._id, artwork: artworkId });
    if (exists) {
      res.status(400);
      throw new Error('Artwork already in wishlist');
    }

    const item = await Wishlist.create({ user: req.user._id, artwork: artworkId });
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove artwork from wishlist
// @route   DELETE /api/wishlist/:artworkId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const result = await Wishlist.findOneAndDelete({
      user: req.user._id,
      artwork: req.params.artworkId,
    });

    if (!result) {
      res.status(404);
      throw new Error('Item not found in wishlist');
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
