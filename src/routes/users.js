const express = require('express');

const db = require('../db');
const logger = require('../utils/logger');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  const result = await db.query('SELECT $1::json as message', [{
    id: 1,
    username: 'testUN'
  }]);

  logger.info('Sending user results: ', result.rows[0].message);

  res.send([result.rows[0].message]);
});

module.exports = router;
