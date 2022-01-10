const { readdirSync } = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const modelsDir = path.join(__dirname, './models');

const name = 'sequelize';

module.exports = (config) => {
  const sequelize = new Sequelize(config);

  const db = {};

  readdirSync(modelsDir)
    .filter((file) => file.indexOf('.') !== 0 && file.slice(-3) === '.js')
    .forEach((file) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const model = require(path.join(modelsDir, file))(
        sequelize,
        Sequelize.DataTypes,
      );
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return {
    testConnection: async () => {
      try {
        console.log(`INFO: test connection ${name}`);
        await sequelize.authenticate();
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    close: async () => {
      console.log(`INFO: Closing ${name} DB wrapper`);
      return sequelize.close();
    },

    createProduct: async (product) => {
      try {
        if (!product.item) {
          throw new Error('ERROR: No product item defined');
        }
        if (!product.type) {
          throw new Error('ERROR: No product type defined');
        }
        if (!product.measure) {
          throw new Error('ERROR: No product measure defined');
        }
        if (!product.measurevalue) {
          throw new Error('ERROR: No product measurevalue defined');
        }
        if (!product.pricetype) {
          throw new Error('ERROR: No product pricetype defined');
        }
        if (!product.pricevalue) {
          throw new Error('ERROR: No product pricevalue defined');
        }

        const p = JSON.parse(JSON.stringify(product));
        const timestamp = Date.now();

        delete p.id;
        p.created_at = timestamp;
        p.updated_at = timestamp;

        const res = await db.Product.create(p);

        console.log(`DEBUG: New product created: ${JSON.stringify(res)}`);
        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    getProduct: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined');
        }

        const res = await db.Product.findOne({
          where: {
            id,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    getAllProduct: async () => {
      try {
        const res = await db.Product.findAll({
          where: {
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    updateProduct: async ({ id, ...product }) => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined');
        }

        if (!Object.keys(product).length) {
          throw new Error('ERROR: Nothing to update');
        }

        const res = await db.Product.update(product, {
          where: { id },
          returning: true,
        });

        console.log(`DEBUG: Product updated: ${JSON.stringify(res[1][0])}`);
        return res[1][0];
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    deleteProduct: async (id) => {
      try {
        if (!id) {
          throw new Error('ERROR: No product id defined');
        }

        // await db.Product.destroy({ where: { id } });
        await db.Product.update({ deleted_at: Date.now() }, { where: { id } });

        return `delete product with id - ${id} successfully`;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },
  };
};
