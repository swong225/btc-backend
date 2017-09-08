const express = require('express');

const logger = require('../utils/logger');
const User = require('../models/user');

const router = express.Router();

/* GET users listing. */
router.get('/', async (req, res) => {
  try {
    const results = await User.findAll();

    res.send(results);
  } catch (err) {
    logger.error('Error retrieving users: ', err);
  }
});

module.exports = router;
