const express = require('express');
const { Client } = require('pg');

const { POSTGRES_USER, POSTGRES_HOST, POSTGRES_DB } = require('../config');
const { POSTGRES_PASSWORD } = require('../config/secrets');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  const client = new Client({
    user: POSTGRES_USER,
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    password: POSTGRES_PASSWORD,
    port: 5432
  });

  client.connect();

  client.query('SELECT $1::json as message', [{
    id: 1,
    username: 'testUN'
  }], (err, response) => {
    res.send([response.rows[0].message]);
    client.end();
  });
});

module.exports = router;
