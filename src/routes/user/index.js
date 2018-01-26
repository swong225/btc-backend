const express = require('express');

const UserController = require('../../controllers/user');

const router = express.Router();

router.route('/allBags').get(UserController.findAllBagsForUser);

module.exports = router;
