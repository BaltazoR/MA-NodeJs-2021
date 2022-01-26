module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      measure: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      measurevalue: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      pricetype: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      pricevalue: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      ItemId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Items',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      TypeId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Types',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    });
  },

  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  },
};
