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

      await Order.create({
        userId: userResult.id || 'temp',
        drink,
        teaType,
        flavor,
        size,
        price
      });

      return res.json({ userId: userResult.id, order });
    } catch (err) {
      logger.error('Error adding order: ', err);

      return res.status(500).end();
    }
  }
};
