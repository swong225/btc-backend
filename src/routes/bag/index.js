const express = require('express');

const BagController = require('../../controllers/bag');

const router = express.Router();

router.route('/').post(BagController.findActiveBagForUser);
router.route('/activeBag').get(BagController.findActiveBagForUser);
router.route('/orderedBag').get(BagController.findOrderedBag);
router.route('/addReorderedItems').post(BagController.addReorderedBagItems);
router.route('/checkout').post(BagController.checkout);

module.exports = router;
