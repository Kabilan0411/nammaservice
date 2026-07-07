const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Professional = sequelize.define('Professional', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  serviceType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true
  },
  zipcode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    defaultValue: 13.0
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    defaultValue: 80.2
  },
  skills: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('skills');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('skills', value ? JSON.stringify(value) : JSON.stringify([]));
    }
  },
  portfolio: {
    type: DataTypes.TEXT,
    get() {
      const rawValue = this.getDataValue('portfolio');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('portfolio', value ? JSON.stringify(value) : JSON.stringify([]));
    }
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 5.0
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isAvailable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Virtual field to output nested location object for full React frontend compatibility
  location: {
    type: DataTypes.VIRTUAL,
    get() {
      return {
        address: this.address,
        city: this.city,
        state: this.state,
        zipcode: this.zipcode,
        coordinates: [parseFloat(this.longitude || 80.2), parseFloat(this.latitude || 13.0)]
      };
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = Professional;
