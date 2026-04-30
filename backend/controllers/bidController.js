const Bid = require('../models/Bid');
const Artwork = require('../models/Artwork');
const Notification = require('../models/Notification');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res, next) => {
  try {
    const { artworkId, bidAmount } = req.body;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      res.status(404);
      throw new Error('Artwork not found');
    }

    if (artwork.status !== 'auction') {
      res.status(400);
      throw new Error('This artwork is not in auction');
    }

    if (artwork.auctionEnd && new Date() > artwork.auctionEnd) {
      res.status(400);
      throw new Error('Auction has ended');
    }

    if (bidAmount <= artwork.highestBid) {
      res.status(400);
      throw new Error('Bid amount must be higher than current highest bid');
    }

    if (bidAmount <= artwork.price) {
      res.status(400);
      throw new Error('Bid amount must be higher than starting price');
    }

    const bid = new Bid({
      user: req.user._id,
      artwork: artworkId,
      bidAmount,
    });

    const createdBid = await bid.save();

    const previousBidder = artwork.highestBidder;
    const previousBid = artwork.highestBid;

    artwork.highestBid = bidAmount;
    artwork.highestBidder = req.user._id;
    await artwork.save();

    // Create notification for previous bidder
    if (previousBidder && previousBidder.toString() !== req.user._id.toString()) {
      const notification = await Notification.create({
        user: previousBidder,
        message: `You have been outbid on "${artwork.title}". New highest bid is $${bidAmount}.`,
      });

      // Emit to socket
      const io = req.app.get('io');
      io.to(previousBidder.toString()).emit('notification', notification);
    }

    res.status(201).json(createdBid);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bids for artwork
// @route   GET /api/bids/:artworkId
// @access  Public
const getBidsByArtworkId = async (req, res, next) => {
  try {
    const bids = await Bid.find({ artwork: req.params.artworkId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    next(error);
  }
};

// @desc    Get bids by current user
// @route   GET /api/bids/my/history
// @access  Private
const getMyBids = async (req, res, next) => {
  try {
    const bids = await Bid.find({ user: req.user._id })
      .populate({
        path: 'artwork',
        select: 'title image price highestBid status',
        populate: { path: 'artist', select: 'name' },
      })
      .sort({ createdAt: -1 });

    res.json(bids);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeBid,
  getBidsByArtworkId,
  getMyBids,
};
