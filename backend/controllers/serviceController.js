const { Service } = require('../models');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll();
    
    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  createService
};
