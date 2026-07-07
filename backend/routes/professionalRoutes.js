const express = require('express');
const router = express.Router();
const { 
  getProfessionals, 
  getProfessional, 
  createProfessional,
  updateProfessionalProfile,
  getMyProfessionalProfile,
  deleteProfessional
} = require('../controllers/professionalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProfessionals)
  .post(protect, createProfessional);

router.route('/me')
  .get(protect, getMyProfessionalProfile);

router.route('/profile')
  .put(protect, updateProfessionalProfile);

router.route('/:id')
  .get(getProfessional)
  .delete(protect, admin, deleteProfessional);

module.exports = router;
