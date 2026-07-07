const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    defaultValue: 'default_icon.png'
  },
  category: {
    type: DataTypes.ENUM('Home Maintenance', 'Cleaning', 'Repair', 'Tutors', 'Other'),
    defaultValue: 'Other'
  }
}, {
  timestamps: true
});

module.exports = Service;
