const Sequelize = require('sequelize');

const { DATABASE_URL } = require('../config');

const db = new Sequelize(DATABASE_URL);

const User = require('../models/user')(db, Sequelize);
const Bag = require('../models/bag')(db, Sequelize);
const Order = require('../models/order')(db, Sequelize);

Bag.hasMany(Order, { onDelete: 'cascade' });
User.hasMany(Bag);

/* Load models and synchronize them */
db.sync();

module.exports = db;
