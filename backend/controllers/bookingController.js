const { User, Professional, Booking, Notification } = require('../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../services/emailService');

// @desc    Get all user or professional bookings
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res, next) => {
  try {
    let bookings;
    const professional = await Professional.findOne({ where: { userId: req.user.id } });

    if (professional) {
      // Return bookings related to the user OR their professional profile
      bookings = await Booking.findAll({
        where: {
          [Op.or]: [
            { userId: req.user.id },
            { professionalId: professional.id }
          ]
        },
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] },
          {
            model: Professional,
            as: 'professional',
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    } else {
      // Just normal user bookings
      bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [
          { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] },
          {
            model: Professional,
            as: 'professional',
            include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
    }

    const formatted = bookings.map(b => {
      const data = b.toJSON();
      data._id = data.id;
      if (data.user) data.user._id = data.user.id;
      if (data.professional) {
        data.professional._id = data.professional.id;
        if (data.professional.user) data.professional.user._id = data.professional.user.id;
      }
      return data;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] },
        {
          model: Professional,
          as: 'professional',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] }]
        }
      ]
    });

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Auth Check: must be user who booked or the professional booked
    const isOwner = booking.userId === req.user.id;
    const isPro = booking.professional?.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isPro && !isAdmin) {
      res.status(401);
      throw new Error('Not authorized to view this booking');
    }

    const data = booking.toJSON();
    data._id = data.id;
    if (data.user) data.user._id = data.user.id;
    if (data.professional) {
      data.professional._id = data.professional.id;
      if (data.professional.user) data.professional.user._id = data.professional.user.id;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const { professionalId, serviceType, date, time, notes, totalAmount } = req.body;

    const professional = await Professional.findByPk(professionalId, {
      include: [{ model: User, as: 'user' }]
    });

    if (!professional) {
      res.status(404);
      throw new Error('Professional not found');
    }

    const booking = await Booking.create({
      userId: req.user.id,
      professionalId,
      serviceType,
      date,
      time,
      notes,
      totalAmount
    });

    // 1. Create notification for Professional
    await Notification.create({
      userId: professional.userId,
      title: 'New Booking Request',
      message: `You have received a new booking request for ${serviceType} on ${new Date(date).toLocaleDateString()} at ${time}.`,
      type: 'booking'
    });

    // 2. Send email to Professional (non-blocking)
    if (professional.user) {
      sendEmail({
        to: professional.user.email,
        subject: 'New Booking Request - NammaService',
        text: `Hello ${professional.user.name},\n\nYou have received a new booking request for ${serviceType} on ${new Date(date).toLocaleDateString()} at ${time}.\n\nLog in to your dashboard to Accept or Decline the request.`,
        userId: professional.userId
      }).catch(err => console.error('Booking request email failed:', err.message));
    }

    const data = booking.toJSON();
    data._id = data.id;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (Confirm, Cancel, Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Professional, as: 'professional', include: [{ model: User, as: 'user' }] }
      ]
    });

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Verify authorized party: user who booked can cancel. Professional can accept/decline/complete.
    const isUser = booking.userId === req.user.id;
    const isPro = booking.professional?.userId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isUser && !isPro && !isAdmin) {
      res.status(401);
      throw new Error('Not authorized to update this booking');
    }

    // Set status
    booking.status = status;
    if (status === 'completed') {
      booking.paymentStatus = 'paid';
    }
    await booking.save();

    // Trigger Dynamic Notifications
    let notifyUserId, emailTo, emailSubject, emailBody;

    if (status === 'confirmed') {
      // Notify client
      notifyUserId = booking.userId;
      emailTo = booking.user?.email;
      emailSubject = 'Booking Confirmed! - NammaService';
      emailBody = `Hello ${booking.user?.name},\n\nYour booking request for ${booking.serviceType} has been accepted and confirmed by ${booking.professional?.user?.name || 'our partner'}.\n\nAppointment Date: ${new Date(booking.date).toLocaleDateString()} at ${booking.time}.`;
    } else if (status === 'cancelled') {
      // Notify the other party
      if (isUser) {
        // user cancelled, notify professional
        notifyUserId = booking.professional?.userId;
        emailTo = booking.professional?.user?.email;
        emailSubject = 'Booking Cancelled by Client - NammaService';
        emailBody = `Hello ${booking.professional?.user?.name},\n\nThe booking request for ${booking.serviceType} scheduled on ${new Date(booking.date).toLocaleDateString()} at ${booking.time} has been cancelled by the client.`;
      } else {
        // professional cancelled, notify user
        notifyUserId = booking.userId;
        emailTo = booking.user?.email;
        emailSubject = 'Booking Update: Request Declined/Cancelled - NammaService';
        emailBody = `Hello ${booking.user?.name},\n\nWe regret to inform you that your booking request for ${booking.serviceType} on ${new Date(booking.date).toLocaleDateString()} at ${booking.time} was declined/cancelled. You can search for other nearby professionals.`;
      }
    } else if (status === 'completed') {
      // Notify client
      notifyUserId = booking.userId;
      emailTo = booking.user?.email;
      emailSubject = 'Service Completed! Please Leave a Review - NammaService';
      emailBody = `Hello ${booking.user?.name},\n\nYour service appointment for ${booking.serviceType} with ${booking.professional?.user?.name} has been marked as completed.\n\nPlease log in to your dashboard to leave a star rating and review.`;
    }

    if (notifyUserId) {
      await Notification.create({
        userId: notifyUserId,
        title: `Booking ${status.toUpperCase()}`,
        message: emailBody.split('\n\n')[1] || `Your booking status has been updated to ${status}.`,
        type: 'booking'
      });

      if (emailTo) {
        sendEmail({
          to: emailTo,
          subject: emailSubject,
          text: emailBody,
          userId: notifyUserId
        }).catch(err => console.error('Booking status update email failed:', err.message));
      }
    }

    const data = booking.toJSON();
    data._id = data.id;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookings,
  getBooking,
  createBooking,
  updateBookingStatus
};
