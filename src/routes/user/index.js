const express = require('express');

const UserController = require('../../controllers/user');

const router = express.Router();

router.route('/').get(UserController.findAll);
router.route('/refresh').get(UserController.refresh);
router.route('/login').post(UserController.login);
router.route('/signup').post(UserController.create);
router.route('/edit').post(UserController.edit);
router.route('/allBags').get(UserController.findAllBagsForUser);

module.exports = router;
