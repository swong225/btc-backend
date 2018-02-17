const User = (db, Sequelize) =>
  db.define('user', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4
    },
    username: { type: Sequelize.STRING, unique: true },
    phone: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    activeBagId: { type: Sequelize.STRING },
    purchasedBagIds: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    }
  });

module.exports = User;
