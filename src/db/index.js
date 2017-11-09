const Sequelize = require('sequelize');

const { POSTGRES_HOST, POSTGRES_PORT } = require('../config');
const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = require('../config/secrets');

const url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

const db = new Sequelize(url);

const User = require('../models/user')(db, Sequelize);
const Bag = require('../models/bag')(db, Sequelize);
const Order = require('../models/order')(db, Sequelize);

Bag.hasMany(Order);

/* Load models and synchronize them */
db.sync();

module.exports = db;
