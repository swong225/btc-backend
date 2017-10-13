const express = require('express');

const UserController = require('../../controllers/order');

const router = express.Router();

router.route('/add').post(UserController.add);

module.exports = router;
