const User = (db, Sequelize) =>
  db.define('user', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4
    },
    username: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING },
    password: { type: Sequelize.STRING },
    activeBagId: { type: Sequelize.STRING },
    purchasedBags: { type: Sequelize.ARRAY(Sequelize.STRING) }
  });

module.exports = User;
