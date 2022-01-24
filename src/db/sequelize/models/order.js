module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'Order',
    {
      id: {
        primaryKey: true,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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

  Order.associate = (models) => {
    Order.belongsTo(models.User);
    Order.hasMany(models.OrderItem);
  };

  return Order;
};
