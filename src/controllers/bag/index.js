const db = require('../../db');

const User = db.model('user');
const Bag = db.model('bag');

const logger = require('../../utils/logger');

module.exports = {
  // finds the drinks for the active bag for the requested user
  findAllOrdersForUser: async (req, res) => {
    try {
      const { username } = req.query;

      const user = await User.findOne({
        where: { username },
        attributes: ['activeBagId']
      });

      const activeBag = await Bag.findOne({ where: { id: user.activeBagId } });
      const orders = activeBag ? await activeBag.getOrders() : [];

      return res.json({ orders });
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  }
};
