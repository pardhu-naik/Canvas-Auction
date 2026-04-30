const Artwork = require('../models/Artwork');
const Order = require('../models/Order');
const Bid = require('../models/Bid');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const stripe = require('stripe')(process.env.STRIPE_SECRET || 'sk_test_mock');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret',
});

// @desc    Get all artworks
// @route   GET /api/artworks
// @access  Public
const getArtworks = async (req, res) => {
  const { category, search, sort, status, color, style, era } = req.query;
  let query = { isApproved: true };

  if (status) {
    if (status !== 'all') {
      query.status = status;
    }
  } else {
    query.status = { $ne: 'sold' };
  }

  if (category) query.category = { $regex: new RegExp(`^${category}$`, 'i') };
  if (search) query.title = { $regex: search, $options: 'i' };
  if (color) query.color = { $regex: new RegExp(`^${color}$`, 'i') };
  if (style) query.style = { $regex: new RegExp(`^${style}$`, 'i') };
  if (era) query.era = { $regex: new RegExp(`^${era}$`, 'i') };

  let sortOptions = {};
  if (sort === 'newest') sortOptions.createdAt = -1;
  else if (sort === 'priceLow') sortOptions.price = 1;
  else if (sort === 'priceHigh') sortOptions.price = -1;

  const artworks = await Artwork.find(query).populate('artist', 'name isVerified').sort(sortOptions);
  res.json(artworks);
};

// @desc    Get single artwork
// @route   GET /api/artworks/:id
// @access  Public
const getArtworkById = async (req, res) => {
  const artwork = await Artwork.findById(req.params.id).populate('artist', 'name bio isVerified');

  if (artwork) {
    res.json(artwork);
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
};

// @desc    Create artwork
// @route   POST /api/artworks
// @access  Private/Artist
const createArtwork = async (req, res) => {
  const { title, description, category, image, price, auctionStart, auctionEnd, status } = req.body;

  const artwork = new Artwork({
    title,
    description,
    category,
    image,
    price,
    artist: req.user._id,
    auctionStart,
    auctionEnd,
    status: status || 'available',
    isApproved: true,
  });

  const createdArtwork = await artwork.save();
  res.status(201).json(createdArtwork);
};

// @desc    Update artwork
// @route   PUT /api/artworks/:id
// @access  Private/Artist
const updateArtwork = async (req, res) => {
  const { title, description, category, image, price, auctionStart, auctionEnd, status } = req.body;

  const artwork = await Artwork.findById(req.params.id);

  if (artwork) {
    if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to update this artwork');
    }

    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.category = category || artwork.category;
    artwork.image = image || artwork.image;
    artwork.price = price || artwork.price;
    artwork.auctionStart = auctionStart || artwork.auctionStart;
    artwork.auctionEnd = auctionEnd || artwork.auctionEnd;
    artwork.status = status || artwork.status;

    const updatedArtwork = await artwork.save();
    res.json(updatedArtwork);
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
};

// @desc    Delete artwork
// @route   DELETE /api/artworks/:id
// @access  Private/Artist
const deleteArtwork = async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);

  if (artwork) {
    if (artwork.artist.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('Not authorized to delete this artwork');
    }
    
    // Cascading deletes
    await Bid.deleteMany({ artwork: req.params.id });
    await Review.deleteMany({ artwork: req.params.id });
    await Wishlist.deleteMany({ artwork: req.params.id });
    
    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: 'Artwork removed and related data cleaned up' });
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
};

// @desc    Purchase artwork (Create Razorpay Order)
// @route   POST /api/artworks/:id/purchase
// @access  Private
const purchaseArtwork = async (req, res) => {
  const artwork = await Artwork.findById(req.params.id);

  if (artwork) {
    if (artwork.status === 'sold') {
      res.status(400);
      throw new Error('Artwork already sold');
    }

    const amount = (artwork.highestBid || artwork.price) * 100; // Amount in paise

    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${artwork._id}`,
    };

    try {
      const order = await razorpay.orders.create(options);
      res.json({
        id: order.id,
        currency: order.currency,
        amount: order.amount,
        artwork_id: artwork._id,
        key_id: process.env.RAZORPAY_KEY_ID
      });
    } catch (error) {
      console.error('Razorpay Order Creation Error:', error);
      const errorMessage = error?.description || error?.message || 'Internal payment gateway error';
      res.status(500);
      throw new Error(`Razorpay initialization failed: ${errorMessage}`);
    }
  } else {
    res.status(404);
    throw new Error('Artwork not found');
  }
};

// @desc    Verify payment and complete order
// @route   POST /api/artworks/verify-payment
// @access  Private
const verifyPayment = async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    artwork_id 
  } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
    .update(body.toString())
    .digest('hex');

  const isSignatureValid = expectedSignature === razorpay_signature;

  if (isSignatureValid) {
    try {
      const artwork = await Artwork.findById(artwork_id);
      if (artwork && artwork.status !== 'sold') {
        artwork.status = 'sold';
        await artwork.save();

        // Create the order record
        await Order.create({
          user: req.user._id,
          artwork: artwork_id,
          artist: artwork.artist,
          paymentId: razorpay_payment_id,
          paymentStatus: 'paid',
          totalAmount: req.body.amount / 100, // Amount was in paise
        });

        res.json({ success: true, message: 'Payment verified and order created' });
      } else {
        res.status(400).json({ success: false, message: 'Artwork already sold or not found' });
      }
    } catch (error) {
      console.error('Order Creation Error:', error);
      res.status(500).json({ success: false, message: 'Verification error' });
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
};

// @desc    Get user orders
// @route   GET /api/artworks/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('artwork', 'title image price');
  res.json(orders);
};

module.exports = {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  purchaseArtwork,
  verifyPayment,
  getMyOrders,
};

