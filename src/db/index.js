const { Pool } = require('pg');

const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DB } = require('../config');
const { POSTGRES_PASSWORD } = require('../config/secrets');

const pool = new Pool({
  user: POSTGRES_USER,
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  password: POSTGRES_PASSWORD,
  port: 5432
});

pool.connect();

module.exports = {
  query: (text, params) => pool.query(text, params)
};
