const db = require('../../db');
const BagController = require('../bag');
const { createToken } = require('../user');

const User = db.model('user');
const Bag = db.model('bag');
const Order = db.model('order');

const logger = require('../../utils/logger');

module.exports = {
  add: async (req, res) => {
    try {
      const { user: userId, order } = req.body;
      const { drink, isTea, teaType, flavor, size, price, chosenToppings } = order;
      let activeBagId;
      let token;

      // determine the user to save the order to, if none exists, create a temp user
      let userResult = await User.findOne({ where: { id: userId } });
      if (!userResult) {
        userResult = await User.create({ id: userId });
        token = createToken(userResult.id);
      }

      // determine the active bag for the user
      if (userResult.activeBagId) {
        activeBagId = userResult.activeBagId;
      } else {
        // if the user does not have an active bag, create a new one and associate with the user
        const newBag = await BagController.createBagForUserId(userResult.id);

        activeBagId = newBag.id;
      }

      const createdOrder = await Order.create({
        userId: userResult.id || 'temp',
        drink,
        isTea,
        teaType,
        flavor,
        size,
        chosenToppings,
        price
      });

      // add the created drink to the bag
      const activeBag = await Bag.findOne({ where: { id: activeBagId } });
      await activeBag.addOrder(createdOrder);

      const { totalPrice } = await BagController.updateByActiveBagId(activeBagId);
      const resultOrder = Object.assign({}, createdOrder.toJSON(), { bagId: activeBagId });

      return res.json({
        createdOrder:
        resultOrder,
        totalPrice,
        token,
        userResult,
        activeBagId: activeBag.id
      });
    } catch (err) {
      logger.error('Error adding order: ', err);

      return res.status(500).end();
    }
  },

  update: async (req, res) => {
    try {
      const { orderId, updateOrder } = req.body;
      const { drink, isTea, teaType, flavor, size, price, chosenToppings } = updateOrder;

      const [affectedCount, affectedRows] = await Order.update(
        {
          drink,
          isTea,
          teaType,
          flavor,
          size,
          chosenToppings,
          price
        },
        {
          where: { id: orderId },
          returning: true
        }
      );

      const { totalPrice } = await BagController.updateByActiveBagId(affectedRows[0].bagId);

      return res.json({ updatedOrder: affectedRows[0], totalPrice });
    } catch (err) {
      logger.error('Error deleting order: ', err);

      return res.status(500).end();
    }
  },

  delete: async (req, res) => {
    try {
      const { orderId } = req.body;

      const deletedOrder = await Order.findOne({ where: { id: orderId } });
      const affectedBag = await Bag.findOne({ where: { id: deletedOrder.bagId } });

      const deleteStatus = await Order.destroy({
        where: { id: orderId }
      });

      const { totalPrice } = await BagController.updateByActiveBagId(affectedBag.id);

      return res.json({ deleteStatus, totalPrice });
    } catch (err) {
      logger.error('Error deleting order: ', err);

      return res.status(500).end();
    }
  }
};
