const User = require('./User');
const Professional = require('./Professional');
const Booking = require('./Booking');
const Review = require('./Review');
const Notification = require('./Notification');
const Service = require('./Service');

// 1. User & Professional (1-to-1)
User.hasOne(Professional, { foreignKey: 'userId', as: 'professionalProfile', onDelete: 'CASCADE' });
Professional.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 2. User & Bookings (1-to-Many)
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 3. Professional & Bookings (1-to-Many)
Professional.hasMany(Booking, { foreignKey: 'professionalId', as: 'bookings', onDelete: 'CASCADE' });
Booking.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

// 4. Professional & Reviews (1-to-Many)
Professional.hasMany(Review, { foreignKey: 'professionalId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Professional, { foreignKey: 'professionalId', as: 'professional' });

// 5. User & Reviews (1-to-Many)
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 6. User & Notifications (1-to-Many)
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 7. Saved Professionals / Bookmarks (Many-to-Many relationship)
User.belongsToMany(Professional, { through: 'SavedProfessionals', as: 'savedProfessionals', foreignKey: 'userId', otherKey: 'professionalId' });
Professional.belongsToMany(User, { through: 'SavedProfessionals', as: 'favoritedBy', foreignKey: 'professionalId', otherKey: 'userId' });

module.exports = {
  User,
  Professional,
  Booking,
  Review,
  Notification,
  Service
};
