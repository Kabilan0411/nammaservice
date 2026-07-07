const { User, Professional } = require('../models');

// @desc    Get user's saved professionals
// @route   GET /api/saved-professionals
// @access  Private
const getSavedProfessionals = async (req, res, next) => {
  try {
    const userObj = await User.findByPk(req.user.id, {
      include: [{
        model: Professional,
        as: 'savedProfessionals',
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar']
        }]
      }]
    });

    const saved = userObj ? userObj.savedProfessionals : [];

    res.status(200).json({
      success: true,
      count: saved.length,
      data: saved
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save a professional
// @route   POST /api/saved-professionals
// @access  Private
const saveProfessional = async (req, res, next) => {
  try {
    const { professionalId } = req.body;

    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      res.status(404);
      throw new Error('Professional not found');
    }

    const userObj = await User.findByPk(req.user.id);
    if (!userObj) {
      res.status(404);
      throw new Error('User not found');
    }

    const alreadySaved = await userObj.hasSavedProfessional(professional);
    if (alreadySaved) {
      res.status(400);
      throw new Error('Professional already saved');
    }

    await userObj.addSavedProfessional(professional);

    res.status(201).json({
      success: true,
      message: 'Professional saved successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove saved professional
// @route   DELETE /api/saved-professionals/:professionalId
// @access  Private
const removeSavedProfessional = async (req, res, next) => {
  try {
    const professional = await Professional.findByPk(req.params.professionalId);
    if (!professional) {
      res.status(404);
      throw new Error('Professional not found');
    }

    const userObj = await User.findByPk(req.user.id);
    if (!userObj) {
      res.status(404);
      throw new Error('User not found');
    }

    const isSaved = await userObj.hasSavedProfessional(professional);
    if (!isSaved) {
      res.status(404);
      throw new Error('Saved professional connection not found');
    }

    await userObj.removeSavedProfessional(professional);

    res.status(200).json({
      success: true,
      message: 'Professional removed from saved list'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSavedProfessionals,
  saveProfessional,
  removeSavedProfessional
};
