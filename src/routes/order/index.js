const express = require('express');

const UserController = require('../../controllers/order');

const router = express.Router();

router.route('/add').post(UserController.add);
router.route('/update').post(UserController.update);
router.route('/delete').delete(UserController.delete);
router.route('/findAllOrders').post(UserController.findAllOrdersForUser);

module.exports = router;
