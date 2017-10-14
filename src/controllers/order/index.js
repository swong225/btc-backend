const Order = require('../../models/order');
const User = require('../../models/user');
const logger = require('../../utils/logger');

module.exports = {
  add: async (req, res) => {
    try {
      const { user, order } = req.body;
      const { drink, teaType, flavor, size, price } = order;

      let userResult = await User.findOne({
        where: { username: user },
        attributes: ['id']
      });

      if (!userResult) {
        userResult = await User.create({ username: 'temp' });
      }

      const createdOrder = await Order.create({
        userId: userResult.id || 'temp',
        drink,
        teaType,
        flavor,
        size,
        price
      });

      return res.json({ userId: userResult.id, order: createdOrder });
    } catch (err) {
      logger.error('Error adding order: ', err);

      return res.status(500).end();
    }
  },

  delete: async (req, res) => {
    try {
      const { orderId } = req.body;

      const deleteStatus = await Order.destroy({
        where: { id: orderId }
      });

      return res.json({ deleteStatus });
    } catch (err) {
      logger.error('Error deleting order: ', err);

      return res.status(500).end();
    }
  },

  findAllOrdersForUser: async (req, res) => {
    try {
      const { username } = req.query;

      const userId = await User.findOne({
        where: { username },
        attributes: ['id']
      });

      const orders = await Order.findAll({
        where: { userId: userId.id },
        attributes: ['id', 'userId', 'drink', 'flavor', 'price', 'size', 'teaType']
      });

      return res.json({ orders });
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  }
};
