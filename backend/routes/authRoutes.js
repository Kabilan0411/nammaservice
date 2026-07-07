const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  verifyOtp,
  sendOtp
} = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max file size
});

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/send-otp', sendOtp);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, upload.single('avatar'), updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Admin-only user management routes
router.route('/users')
  .get(protect, admin, getUsers);
router.route('/users/:id')
  .delete(protect, admin, deleteUser);

module.exports = router;
