const express = require('express');

const db = require('../db');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  db.query('SELECT $1::json as message', [{
    id: 1,
    username: 'testUN'
  }]).then(result => {
    res.send([result.rows[0].message]);
  });
});

module.exports = router;
