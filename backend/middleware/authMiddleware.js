const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (jwtErr) {
        res.status(401);
        return next(new Error('Not authorized, token failed'));
      }

      // Get user from database
      const user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        res.status(401);
        return next(new Error('Not authorized, user not found'));
      }

      // Set user object on request (use JSON representation to match expected structure)
      req.user = user.toJSON();
      
      next();
    } catch (error) {
      console.error("Authentication middleware failure:", error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401);
    next(new Error('Not authorized as an admin'));
  }
};

module.exports = { protect, admin };
