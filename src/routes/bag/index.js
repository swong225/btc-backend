const express = require('express');

const BagController = require('../../controllers/bag');

const router = express.Router();

router.route('/findAllOrders').post(BagController.findAllOrdersForUser);

module.exports = router;
