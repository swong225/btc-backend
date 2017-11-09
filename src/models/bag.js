const Bag = (db, Sequelize) =>
  db.define('bag', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4
    },
    totalPrice: { type: Sequelize.DECIMAL }
  });

module.exports = Bag;
