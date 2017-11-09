const db = require('../../db');
const BagController = require('../bag');

const User = db.model('user');
const Bag = db.model('bag');
const Order = db.model('order');

const logger = require('../../utils/logger');

module.exports = {
  add: async (req, res) => {
    try {
      const { user, order } = req.body;
      const { drink, isTea, teaType, flavor, size, price } = order;
      let activeBagId;

      // determine the user to save the order to, if none exists, create a temp user
      let userResult = await User.findOne({ where: { username: user } });
      if (!userResult) {
        userResult = await User.create({ username: 'temp' });
      }

      // determine the active bag for the user
      if (userResult.activeBagId) {
        activeBagId = userResult.activeBagId;
      } else {
        // if the user does not have an active bag, create a new one and associate with the user
        const activeBag = await Bag.create();
        activeBagId = activeBag.id;

        await User.update(
          { activeBagId },
          {
            where: { id: userResult.id },
            returning: true
          }
        );
      }

      const createdOrder = await Order.create({
        userId: userResult.id || 'temp',
        drink,
        isTea,
        teaType,
        flavor,
        size,
        price
      });

      // add the created drink to the bag
      const activeBag = await Bag.findOne({ where: { id: activeBagId } });
      await activeBag.addOrder(createdOrder);

      BagController.updateByActiveBagId(activeBagId);
      // await activeBag.increment(['totalPrice'], { by: price });

      return res.json({ userId: userResult.id, order: createdOrder });
    } catch (err) {
      logger.error('Error adding order: ', err);

      return res.status(500).end();
    }
  },

  update: async (req, res) => {
    try {
      const { orderId, updateOrder } = req.body;
      const { drink, isTea, teaType, flavor, size, price } = updateOrder;

      const [affectedCount, affectedRows] = await Order.update(
        {
          drink,
          isTea,
          teaType,
          flavor,
          size,
          price
        },
        {
          where: { id: orderId },
          returning: true
        }
      );

      const updateBag = await BagController.updateByActiveBagId(affectedRows[0].bagId);

      return res.json({ updatedOrder: affectedRows });
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

      BagController.updateByActiveBagId(affectedBag.id);

      // await affectedBag.decrement(['totalPrice'], { by: deletedOrder.price });

      return res.json({ deleteStatus });
    } catch (err) {
      logger.error('Error deleting order: ', err);

      return res.status(500).end();
    }
  }
};
