const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('../../db');

const User = db.model('user');
const Bag = db.model('bag');
const Order = db.model('order');

const config = require('../../config');
const logger = require('../../utils/logger');
const { JWT_PASSPHRASE } = require('../../config');

const createToken = userId => (
  jwt.sign({ sub: userId }, JWT_PASSPHRASE, {
    issuer: config.JWT_ISSUER,
    expiresIn: config.JWT_EXP
  })
);

module.exports = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username }, raw: true });

      if (!user) res.status(400).end();

      const validPassword = await bcrypt.compare(password, user.password);

      if (validPassword) {
        const token = createToken(user.id);

        delete user.password;

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
      const { username, password, phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
      const newUser = await User.create({ username, phone, password: hashedPassword });

      const token = createToken(newUser.id);

      delete newUser.dataValues.password;

      return res.json({ token, user: newUser });
    } catch (err) {
      logger.error('Error creating new user: ', err);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(500).send('Email Already Registered');
      }
      return res.status(500).send('Error Creating User');
    }
  },

  edit: async (req, res) => {
    try {
      const { userId, username, password, phone } = req.body;

      const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);
      const query = password ? {
        username,
        phone,
        password: hashedPassword
      } : { username, phone };

      const updatedUser = await User.update(query, {
        where: { id: userId },
        returning: true,
        plain: true
      });

      const token = createToken(updatedUser.id);

      return res.json({ token, updatedUser: updatedUser[1] });
    } catch (err) {
      logger.error('Error creating new user: ', err);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(500).send('Email Already Registered');
      }
      return res.status(500).send('Error Creating User');
    }
  },

  refresh: async (req, res) => {
    try {
      const { userId } = req.query;

      const user = await User.findOne({ where: { id: userId } });

      return res.json({ user });
    } catch (err) {
      logger.error('Error refreshing user: ', err);

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

      // sort result array with newest at front
      purchasedBags.sort((a, b) => b.updatedAt - a.updatedAt);

      return res.json(purchasedBags);
    } catch (err) {
      logger.error('Error retrieving user orders: ', err);

      return res.status(500).end();
    }
  }
};
