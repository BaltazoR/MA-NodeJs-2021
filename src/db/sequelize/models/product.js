module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    'Product',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
      },
      measure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      measurevalue: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      pricetype: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pricevalue: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  );

  Product.associate = (models) => {
    Product.belongsTo(models.Item);
    Product.belongsTo(models.Type);
    Product.hasMany(models.OrderItem);
  };

  return Product;
};
