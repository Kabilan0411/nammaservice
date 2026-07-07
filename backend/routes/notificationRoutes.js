const express = require('express');
const router = express.Router();
const { 
  getNotifications, 
  readNotification, 
  readAllNotifications, 
  deleteNotification 
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getNotifications);

router.route('/read-all')
  .put(readAllNotifications);

router.route('/:id/read')
  .put(readNotification);

router.route('/:id')
  .delete(deleteNotification);

module.exports = router;
