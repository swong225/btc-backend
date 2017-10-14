const Sequelize = require('sequelize');

const db = require('../db');

const User = db.define('order', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    defaultValue: Sequelize.DataTypes.UUIDV4
  },
  userId: { type: Sequelize.STRING },
  drink: { type: Sequelize.STRING },
  teaType: { type: Sequelize.STRING },
  flavor: { type: Sequelize.STRING },
  size: { type: Sequelize.STRING },
  price: { type: Sequelize.DECIMAL }
});

module.exports = User;
