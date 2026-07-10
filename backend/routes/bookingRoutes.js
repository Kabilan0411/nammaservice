const express = require('express');
console.log("✈️ bookingRoutes.js file successfully loaded!");
const router = express.Router();
const { getBookings, createBooking, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBookings)
  .post(protect, createBooking);

router.route('/:id/status')
  .put(protect, updateBookingStatus);

module.exports = router;
