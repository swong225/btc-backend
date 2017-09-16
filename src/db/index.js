const Sequelize = require('sequelize');

const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DB } = require('../config');
const { POSTGRES_PASSWORD } = require('../config/secrets');

const url = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

const db = new Sequelize(url);

/* Load models and synchronize them */
db.sync();

module.exports = db;
