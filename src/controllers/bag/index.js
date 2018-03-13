const db = require('../../db');

const User = db.model('user');
const Bag = db.model('bag');
const Order = db.model('order');

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
      const { userId } = req.query;

      const user = await User.findOne({ where: { id: userId } });

      // if there is no active bag, create a new empty bag
      if (!user.activeBagId) {
        const newBag = await createBagForUserId(user.id);

        return res.json(newBag);
      }

      const activeBag = await updateByActiveBagId(user.activeBagId);

      return res.json({ activeBag, activeBagId: user.activeBagId });
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  },

  checkout: async (req, res) => {
    try {
      const { userId, username, phone } = req.body;

      const user = await User.findOne({ where: { id: userId } });
      user.update({ username, phone });
      const activeBagId = user.activeBagId;
      const purchasedBagIds = user.purchasedBagIds;

      purchasedBagIds.push(activeBagId);

      const newBag = await createBagForUserId(user.id);

      await User.update(
        {
          activeBagId: newBag.id,
          purchasedBagIds
        },
        { where: { id: userId } }
      );

      const purchasedBag = await Bag.findOne({ where: { id: activeBagId } });

      return res.status(200).json({ purchasedBag, userId, newBagId: newBag.id });
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  },

  findOrderedBag: async (req, res) => {
    try {
      const { bagId } = req.query;

      const bag = await Bag.findOne({ where: { id: bagId } });
      const orderedBag = await bag.getOrders();

      return res.json(orderedBag);
    } catch (err) {
      logger.error('Error retrieving bag: ', err);

      return res.status(500).end();
    }
  },

  addReorderedBagItems: async (req, res) => {
    try {
      const { user: username, bagId } = req.body;

      const bag = await Bag.findOne({ where: { id: bagId } });
      const reorderedBag = await bag.getOrders({ raw: true });

      const { activeBagId } = await User.findOne({ where: { username }, raw: true });
      const activeBag = await Bag.findOne({ where: { id: activeBagId } });

      const addingOrdersPromises = reorderedBag.map(async drink => {
        const newDrink = Object.assign({}, drink);
        delete newDrink.id;
        delete newDrink.bagId;
        const reorder = await Order.create(newDrink);
        await activeBag.addOrder(reorder);
      });

      await Promise.all(addingOrdersPromises);
      await updateByActiveBagId(activeBagId);

      const { totalPrice } = await await Bag.findOne({ where: { id: activeBagId }, raw: true });
      const newOrders = await activeBag.getOrders({ raw: true });

      const newBag = Object.assign({}, { drinks: newOrders }, { totalCost: totalPrice });

      return res.json(newBag);
    } catch (err) {
      logger.error('Error retrieving bag: ', err);

      return res.status(500).end();
    }
  },

  updateByActiveBagId,
  createBagForUserId
};
