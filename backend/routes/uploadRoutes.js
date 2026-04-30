const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @desc    Upload an image file
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  res.json({
    imageUrl: `/uploads/${req.file.filename}`,
    message: 'Image uploaded successfully',
  });
});

module.exports = router;
