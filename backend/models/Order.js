const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Artwork',
    },
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    paymentId: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
