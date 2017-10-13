const Order = require('../../models/order');
const User = require('../../models/user');
const logger = require('../../utils/logger');

module.exports = {
  add: async (req, res) => {
    try {
      const { user, order } = req.body;
      const { drink, teaType, flavor, size, price } = order;

      const userId = await User.findOne({
        where: { username: user },
        attributes: ['id']
      });

      await Order.create({
        userId: userId.id || 'temp',
        drink,
        teaType,
        flavor,
        size,
        price
      });

      return res.status(200).end();
    } catch (err) {
      logger.error('Error adding order: ', err);

      return res.status(500).end();
    }
  }
};
