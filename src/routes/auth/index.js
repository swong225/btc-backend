const express = require('express');

const UserController = require('../../controllers/user');

const router = express.Router();

router.route('/').get(UserController.findAll);
router.route('/login').post(UserController.login);
router.route('/signup').post(UserController.create);

module.exports = router;
