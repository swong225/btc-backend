const express = require('express');

const db = require('../db');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  const result = await db.query('SELECT $1::json as message', [{
    id: 1,
    username: 'testUN'
  }]);

  res.send([result.rows[0].message]);
});

module.exports = router;
