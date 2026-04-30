const express = require('express');
const router = express.Router();
const {
  getArtworks,
  getArtworkById,
  createArtwork,
  updateArtwork,
  deleteArtwork,
  purchaseArtwork,
  verifyPayment,
  getMyOrders,
} = require('../controllers/artworkController');
const { protect, artist } = require('../middleware/authMiddleware');

router.route('/').get(getArtworks).post(protect, artist, createArtwork);
router.get('/my-orders', protect, getMyOrders);
router.post('/verify-payment', protect, verifyPayment);
router.post('/:id/purchase', protect, purchaseArtwork);
router
  .route('/:id')
  .get(getArtworkById)
  .put(protect, artist, updateArtwork)
  .delete(protect, artist, deleteArtwork);

module.exports = router;
