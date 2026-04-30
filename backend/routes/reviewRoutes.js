const express = require('express');
const router = express.Router();
const { getReviewsByArtwork, createReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createReview);
router.route('/:artworkId').get(getReviewsByArtwork);
router.route('/:id').delete(protect, deleteReview);

module.exports = router;
