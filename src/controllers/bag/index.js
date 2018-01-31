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

const createBagForUserId = async userId => {
  // if the user does not have an active bag, create a new one and associate with the user
  const newBag = await Bag.create();

  const user = await User.findOne({ where: { id: userId } });
  await user.update({ activeBagId: newBag.id });
  await user.addBag(newBag.id);

  return newBag;
};

module.exports = {
  // finds the drinks for the active bag for the requested user
  findActiveBagForUser: async (req, res) => {
    try {
      const { username } = req.query;

      const user = await User.findOne({ where: { username } });

      // if there is no active bag, create a new empty bag
      if (!user.activeBagId) {
        const newBag = await createBagForUserId(user.id);

        return res.json(newBag);
      }

      const activeBag = await updateByActiveBagId(user.activeBagId);

      return res.json(activeBag);
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  },

  checkout: async (req, res) => {
    try {
      const { username } = req.body;

      const user = await User.findOne({ where: { username } });
      const activeBagId = user.activeBagId;
      const purchasedBagIds = user.purchasedBagIds;

      purchasedBagIds.push(activeBagId);

      await User.update(
        {
          activeBagId: null,
          purchasedBagIds
        },
        { where: { username } }
      );

      const purchasedBag = await Bag.findOne({ where: { id: activeBagId } });

      return res.status(200).json({ purchasedBag, username });
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  },

  findOrderedBag: async (req, res) => {
    try {
      const { bagId } = req.query;

      const orderedBag = await Bag.findOne({ where: { id: bagId } });

      return res.json(orderedBag);
    } catch (err) {
      logger.error('Error retrieving bag: ', err);

      return res.status(500).end();
    }
  },

  updateByActiveBagId,
  createBagForUserId
};
