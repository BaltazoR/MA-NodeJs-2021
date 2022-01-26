module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define(
    'Type',
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: sequelize.literal('uuid_generate_v4()'),
      },
      type: {
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

  Type.associate = (models) => {
    Type.hasMany(models.Product);
  };

  return Type;
};
