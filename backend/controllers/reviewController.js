const { User, Professional, Review } = require('../models');

// @desc    Get reviews for a professional
// @route   GET /api/reviews/:professionalId
// @access  Public
const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.findAll({
      where: { professionalId: req.params.professionalId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });

    const formatted = reviews.map(r => {
      const data = r.toJSON();
      data._id = data.id;
      if (data.user) data.user._id = data.user.id;
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

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { professionalId, title, text, rating } = req.body;

    const professional = await Professional.findByPk(professionalId);
    if (!professional) {
      res.status(404);
      throw new Error('Professional not found');
    }

    const review = await Review.create({
      userId: req.user.id,
      professionalId,
      title,
      text,
      rating
    });

    // Recalculate average rating and count
    const reviews = await Review.findAll({ where: { professionalId } });
    const reviewCount = reviews.length;
    const sumRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = sumRating / reviewCount;

    professional.averageRating = parseFloat(averageRating.toFixed(1));
    professional.reviewCount = reviewCount;
    await professional.save();

    const data = review.toJSON();
    data._id = data.id;

    res.status(201).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviews,
  createReview
};
