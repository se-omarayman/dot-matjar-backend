/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('cart_products', {
    cart_products_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cart_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'cart',
        key: 'cart_id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    product_color: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
  }, {
    tableName: 'cart_products',
  });
};
