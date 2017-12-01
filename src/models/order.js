const Order = (db, Sequelize) =>
  db.define('order', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.DataTypes.UUIDV4
    },
    drink: { type: Sequelize.STRING },
    isTea: { type: Sequelize.BOOLEAN },
    teaType: { type: Sequelize.STRING },
    flavor: { type: Sequelize.STRING },
    size: { type: Sequelize.STRING },
    price: { type: Sequelize.DECIMAL },
    chosenToppings: { type: Sequelize.ARRAY(Sequelize.STRING) }
  });

module.exports = Order;
