const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const userModel = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  nom: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  prenom: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  pseudo: {
    type: DataTypes.STRING(32),
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(128),
    allowNull: true
  },
  ban: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  passwordhash: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  mail: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  solde: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'users',
  schema: 'public',
  timestamps: false
});

module.exports = userModel;