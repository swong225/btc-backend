const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../db');

const User = db.model('user');
const Bag = db.model('bag');
const Order = db.model('order');

const config = require('../../config');
const logger = require('../../utils/logger');
const { JWT_PASSPHRASE } = require('../../config');

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });

      if (!user) res.status(400).end();

      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        const token = jwt.sign({ sub: user.id }, JWT_PASSPHRASE, {
          issuer: config.JWT_ISSUER,
          expiresIn: config.JWT_EXP
        });

        delete user.dataValues.password;

        return res.json({ token, user });
      }

      return res.status(401).end();
    } catch (err) {
      logger.error('Error logging user in:', err);
      return res.status(500).end();
    }
  },

  create: async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
      await User.create({ username, email, password: hashedPassword });

      return res.status(200).end();
    } catch (err) {
      logger.error('Error creating new user: ', err);

      return res.status(500).end();
    }
  },

  findAll: async (req, res) => {
    try {
      const users = await User.findAll();

      return res.json(users);
    } catch (err) {
      logger.error('Error retrieving users:', err);
      return res.status(500).end();
    }
  },

  // returns an array of previously purchased bags
  findAllBagsForUser: async (req, res) => {
    try {
      const { username } = req.query;

      const user = await User.findOne({ where: { username } });
      const { purchasedBagIds = [] } = user;

      const purchasedBagsPromises = purchasedBagIds.map(async purchasedBagId => {
        const bag = await Bag.findOne({ where: { id: purchasedBagId } });
        const drinksCount = await Order.count({ where: { bagId: purchasedBagId } });

        return Object.assign({}, bag.dataValues, { drinksCount });
      });

      const purchasedBags = await Promise.all(purchasedBagsPromises);

      return res.json(purchasedBags);
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  }
};
