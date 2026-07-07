const { Notification } = require('../models');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const readNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    if (notification.userId !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to access this notification');
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const readAllNotifications = async (req, res, next) => {
  try {
    await Notification.update(
      { read: true },
      { where: { userId: req.user.id, read: false } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    if (notification.userId !== req.user.id) {
      res.status(401);
      throw new Error('Not authorized to delete this notification');
    }

    await notification.destroy();

    res.status(200).json({
      success: true,
      message: 'Notification removed'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  readNotification,
  readAllNotifications,
  deleteNotification
};
