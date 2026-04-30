const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: String,
    style: String,
    era: String,
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    auctionStart: {
      type: Date,
    },
    auctionEnd: {
      type: Date,
    },
    highestBid: {
      type: Number,
      default: 0,
    },
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'auction'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

const Artwork = mongoose.model('Artwork', artworkSchema);
module.exports = Artwork;
