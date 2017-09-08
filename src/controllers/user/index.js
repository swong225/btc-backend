const bcrypt = require('bcryptjs');

const User = require('../../models/user');
const config = require('../../config');
const logger = require('../../utils/logger');

module.exports = {
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
  }
};
