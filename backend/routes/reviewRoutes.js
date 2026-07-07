const express = require('express');
const router = express.Router();
const { getReviews, createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createReview);

router.route('/:professionalId')
  .get(getReviews);

module.exports = router;
