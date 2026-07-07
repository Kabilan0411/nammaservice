const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: 'https://res.cloudinary.com/demo/image/upload/v1580996846/avatar.png'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  otpCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  otpExpiry: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Custom prototype method to match password
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
