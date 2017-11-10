const db = require('../../db');

const User = db.model('user');
const Bag = db.model('bag');

const logger = require('../../utils/logger');

const updateByActiveBagId = async activeBagId => {
  const activeBag = await Bag.findOne({ where: { id: activeBagId } });
  const orders = activeBag ? await activeBag.getOrders() : [];

  let totalPrice = 0;
  orders.forEach(order => {
    totalPrice += Number(order.price);
  });

  await activeBag.update({ totalPrice }, { where: { id: activeBagId } });

  return { orders, totalPrice };
};

module.exports = {
  // finds the drinks for the active bag for the requested user
  findActiveBagForUser: async (req, res) => {
    try {
      const { username } = req.query;

      const user = await User.findOne({
        where: { username },
        attributes: ['activeBagId']
      });

      const activeBag = await updateByActiveBagId(user.activeBagId);

      return res.json(activeBag);
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  },
  updateByActiveBagId
};
