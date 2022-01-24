module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define(
    'Item',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
      },
      item: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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

  Item.associate = (models) => {
    Item.hasMany(models.Product);
  };

  return Item;
};
