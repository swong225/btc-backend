const express = require('express');

const BagController = require('../../controllers/bag');

const router = express.Router();

router.route('/findAllOrders').post(BagController.findActiveBagForUser);

module.exports = router;
