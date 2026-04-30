const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/authController');
const { protect, admin, artist } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-request', protect, artist, requestVerification);
router.put('/verify-status/:id', protect, admin, updateVerificationStatus);

// User Management Routes (Admin)
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

module.exports = router;
