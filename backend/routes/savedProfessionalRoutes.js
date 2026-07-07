const express = require('express');
const router = express.Router();
const { 
  getSavedProfessionals, 
  saveProfessional, 
  removeSavedProfessional 
} = require('../controllers/savedProfessionalController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getSavedProfessionals)
  .post(saveProfessional);

router.route('/:professionalId')
  .delete(removeSavedProfessional);

module.exports = router;
