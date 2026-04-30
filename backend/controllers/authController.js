const User = require('../models/User');
const Artwork = require('../models/Artwork');
const Bid = require('../models/Bid');
const Review = require('../models/Review');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, mobileNumber } = req.body;

    const userExists = await User.findOne({ 
      $or: [{ email }, { mobileNumber }] 
    });

    if (userExists) {
      res.status(400);
      throw new Error('User with this email or mobile number already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      mobileNumber,
    });

    if (user) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber,
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'User logged out' });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobileNumber: user.mobileNumber,
        profileImage: user.profileImage,
        bio: user.bio,
        isVerified: user.isVerified,
        verificationStatus: user.verificationStatus,
        verificationRequest: user.verificationRequest,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.profileImage = req.body.profileImage || user.profileImage;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        mobileNumber: updatedUser.mobileNumber,
        profileImage: updatedUser.profileImage,
        bio: updatedUser.bio,
        isVerified: updatedUser.isVerified,
        verificationStatus: updatedUser.verificationStatus,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { mobileNumber } = req.body;

    const user = await User.findOne({ mobileNumber });

    if (!user) {
      res.status(404);
      throw new Error('User not found with this mobile number');
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = otpExpires;
    await user.save();

    // In production, send SMS here. For dev, log to console.
    console.log(`[AUTH] OTP for ${mobileNumber}: ${otp}`);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { mobileNumber, otp, password } = req.body;

    const user = await User.findOne({
      mobileNumber,
      resetPasswordOTP: otp,
      resetPasswordOTPExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error('Invalid or expired OTP');
    }

    user.password = password;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Request Artist Verification
// @route   POST /api/auth/verify-request
// @access  Private (Artist only)
const requestVerification = async (req, res, next) => {
  try {
    const { portfolioUrl, documentUrl } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.role !== 'artist') {
      res.status(403);
      throw new Error('Only artists can request verification');
    }

    user.verificationStatus = 'pending';
    user.verificationRequest = {
      portfolioUrl,
      documentUrl,
      appliedAt: Date.now(),
    };

    await user.save();
    res.status(200).json({ 
      message: 'Verification request submitted successfully',
      status: user.verificationStatus 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Verification Status (Admin)
// @route   PUT /api/auth/verify-status/:id
// @access  Private (Admin only)
const updateVerificationStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (status === 'verified') {
      user.isVerified = true;
      user.verificationStatus = 'verified';
    } else if (status === 'rejected') {
      user.isVerified = false;
      user.verificationStatus = 'rejected';
    } else {
      res.status(400);
      throw new Error('Invalid status update');
    }

    await user.save();
    res.status(200).json({ 
      message: `User verification status updated to ${status}`,
      isVerified: user.isVerified,
      status: user.verificationStatus 
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.role === 'admin') {
        res.status(400);
        throw new Error('Cannot delete admin user');
      }

      // Cascading deletes
      await Artwork.deleteMany({ artist: req.params.id });
      await Bid.deleteMany({ user: req.params.id });
      await Review.deleteMany({ user: req.params.id });
      await Wishlist.deleteMany({ user: req.params.id });
      await Order.deleteMany({ user: req.params.id });
      await Notification.deleteMany({ user: req.params.id });

      await User.findByIdAndDelete(req.params.id);
      res.json({ message: 'User removed and all related data cleaned up' });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  requestVerification,
  updateVerificationStatus,
  getUsers,
  deleteUser,
};
