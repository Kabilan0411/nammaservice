const { User, Professional, Review } = require('../models');
const { Op } = require('sequelize');
const { sendEmail } = require('../services/emailService');

// @desc    Get all professionals with filters
// @route   GET /api/professionals
// @access  Public
const getProfessionals = async (req, res, next) => {
  try {
    const { serviceType, location, rating, experience, price, sort } = req.query;

    let whereClause = {};

    if (serviceType) {
      whereClause.serviceType = { [Op.like]: `%${serviceType}%` };
    }

    if (location) {
      whereClause[Op.or] = [
        { city: { [Op.like]: `%${location}%` } },
        { address: { [Op.like]: `%${location}%` } },
        { zipcode: { [Op.like]: `%${location}%` } }
      ];
    }

    if (rating) {
      whereClause.averageRating = { [Op.gte]: parseFloat(rating) };
    }

    if (experience) {
      whereClause.experience = { [Op.gte]: parseInt(experience) };
    }

    if (price) {
      whereClause.hourlyRate = { [Op.lte]: parseFloat(price) };
    }

    let order = [['averageRating', 'DESC']];
    if (sort === '-averageRating') {
      order = [['averageRating', 'DESC']];
    } else if (sort === 'hourlyRate') {
      order = [['hourlyRate', 'ASC']];
    } else if (sort === '-hourlyRate') {
      order = [['hourlyRate', 'DESC']];
    }

    const professionals = await Professional.findAll({
      where: whereClause,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] }],
      order
    });

    // Map response to match Mongo output structure (e.g. converting id to _id)
    const formatted = professionals.map(p => {
      const data = p.toJSON();
      data._id = data.id;
      if (data.user) {
        data.user._id = data.user.id;
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

// @desc    Get single professional
// @route   GET /api/professionals/:id
// @access  Public
const getProfessional = async (req, res, next) => {
  try {
    const professional = await Professional.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }]
        }
      ]
    });

    if (!professional) {
      res.status(404);
      throw new Error('Professional not found');
    }

    const data = professional.toJSON();
    data._id = data.id;
    if (data.user) {
      data.user._id = data.user.id;
    }
    if (data.reviews) {
      data.reviews = data.reviews.map(r => {
        r._id = r.id;
        if (r.user) r.user._id = r.user.id;
        return r;
      });
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create professional profile
// @route   POST /api/professionals
// @access  Private
const createProfessional = async (req, res, next) => {
  try {
    const existingProfile = await Professional.findOne({ where: { userId: req.user.id } });

    if (existingProfile) {
      res.status(400);
      throw new Error('User already has a professional profile');
    }

    const professional = await Professional.create({
      userId: req.user.id,
      serviceType: req.body.serviceType,
      title: req.body.title,
      bio: req.body.bio,
      experience: req.body.experience,
      hourlyRate: req.body.hourlyRate,
      address: req.body.location?.address,
      city: req.body.location?.city,
      state: req.body.location?.state,
      zipcode: req.body.location?.zipcode,
      latitude: req.body.location?.coordinates?.[1] || 13.0,
      longitude: req.body.location?.coordinates?.[0] || 80.2,
      skills: req.body.skills,
      portfolio: req.body.portfolio || [],
      whatsappNumber: req.body.whatsappNumber,
      isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
    });

    // Trigger congratulations email notification
    await sendEmail({
      to: req.user.email,
      subject: 'Congratulations! Your Partner Profile is Live',
      text: `Hello ${req.user.name},\n\nYour professional partner profile for ${req.body.serviceType} has been successfully registered on NammaService!\n\nClients can now view your hourly rate of ₹${req.body.hourlyRate}/hr and request bookings.`,
      userId: req.user.id
    });

    const data = professional.toJSON();
    data._id = data.id;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update professional profile
// @route   PUT /api/professionals/profile
// @access  Private
const updateProfessionalProfile = async (req, res, next) => {
  try {
    const professional = await Professional.findOne({ where: { userId: req.user.id } });

    if (!professional) {
      res.status(404);
      throw new Error('Professional profile not found');
    }

    const fieldsToUpdate = ['serviceType', 'title', 'bio', 'experience', 'hourlyRate', 'skills', 'portfolio', 'isAvailable', 'whatsappNumber'];

    fieldsToUpdate.forEach(field => {
      if (req.body[field] !== undefined) {
        professional[field] = req.body[field];
      }
    });

    if (req.body.location) {
      if (req.body.location.address !== undefined) professional.address = req.body.location.address;
      if (req.body.location.city !== undefined) professional.city = req.body.location.city;
      if (req.body.location.state !== undefined) professional.state = req.body.location.state;
      if (req.body.location.zipcode !== undefined) professional.zipcode = req.body.location.zipcode;
      if (req.body.location.coordinates !== undefined) {
        professional.longitude = req.body.location.coordinates[0];
        professional.latitude = req.body.location.coordinates[1];
      }
    }

    const updated = await professional.save();
    const data = updated.toJSON();
    data._id = data.id;

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in professional profile
// @route   GET /api/professionals/me
// @access  Private
const getMyProfessionalProfile = async (req, res, next) => {
  try {
    const professional = await Professional.findOne({
      where: { userId: req.user.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'email'] },
        { model: Review, as: 'reviews' }
      ]
    });

    if (!professional) {
      return res.status(200).json({
        success: false,
        message: 'No professional profile found for this user'
      });
    }

    const data = professional.toJSON();
    data._id = data.id;
    if (data.user) {
      data.user._id = data.user.id;
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete professional profile
// @route   DELETE /api/professionals/:id
// @access  Private/Admin
const deleteProfessional = async (req, res, next) => {
  try {
    const professional = await Professional.findByPk(req.params.id);
    if (!professional) {
      res.status(404);
      throw new Error('Professional not found');
    }
    
    await professional.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Professional partner profile deregistered successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfessionals,
  getProfessional,
  createProfessional,
  updateProfessionalProfile,
  getMyProfessionalProfile,
  deleteProfessional
};
