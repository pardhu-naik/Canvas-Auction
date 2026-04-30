const express = require('express');
const router = express.Router();
const { placeBid, getBidsByArtworkId, getMyBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, placeBid);
router.route('/my/history').get(protect, getMyBids);
router.route('/:artworkId').get(getBidsByArtworkId);

module.exports = router;
