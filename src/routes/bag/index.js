const express = require('express');

const BagController = require('../../controllers/bag');

const router = express.Router();

router.route('/findAllOrders').post(BagController.findActiveBagForUser);
router.route('/checkout').post(BagController.checkout);

module.exports = router;