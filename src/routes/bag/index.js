const express = require('express');

const BagController = require('../../controllers/bag');

const router = express.Router();

router.route('/').post(BagController.findActiveBagForUser);
router.route('/activeBag').get(BagController.findActiveBagForUser);
router.route('/checkout').post(BagController.checkout);

module.exports = router;
