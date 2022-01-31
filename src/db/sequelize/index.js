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
        // await sequelize.sync({ force: true });
        // await sequelize.sync();
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
        let res = '';

        delete p.id;
        p.created_at = timestamp;
        p.updated_at = timestamp;

        // p = await productRelation(p);

        let itemId = await db.Item.findOne({
          where: {
            item: p.item,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        if (!itemId) {
          const item = await db.Item.create({
            item: p.item,
          });
          itemId = item;
        }

        p.ItemId = itemId.id;

        let typeId = await db.Type.findOne({
          where: {
            type: p.type,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        if (!typeId) {
          const type = await db.Type.create({
            type: p.type,
          });
          typeId = type;
        }

        p.TypeId = typeId.id;

        const existProduct = await db.Product.findOne({
          where: {
            pricevalue: p.pricevalue,
            TypeId: p.TypeId,
            ItemId: p.ItemId,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        if (!existProduct) {
          res = await db.Product.create(p);
        } else {
          const { id } = existProduct;
          p.measurevalue += existProduct.measurevalue;
          res = await db.Product.update(p, {
            where: { id },
            returning: true,
          });
        }
        // console.log(`DEBUG: New product created: ${JSON.stringify(res)}`);
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
          include: [{ model: db.Item }, { model: db.Type }],
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
          include: [db.Item, db.Type],
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

        const origProduct = await db.Product.findOne({
          where: {
            id,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        let origItem = '';
        let origType = '';
        let newItem = '';
        let newType = '';

        if (origProduct) {
          origItem = await db.Item.findOne({
            where: {
              id: origProduct.ItemId,
              deleted_at: { [Sequelize.Op.is]: null },
            },
          });

          origType = await db.Type.findOne({
            where: {
              id: origProduct.TypeId,
              deleted_at: { [Sequelize.Op.is]: null },
            },
          });
        }

        if (product.type && product.type !== origType.type) {
          newType = await db.Type.findOne({
            where: {
              type: product.type,
              deleted_at: { [Sequelize.Op.is]: null },
            },
          });

          if (!newType) {
            newType = await db.Type.create({
              type: product.type,
            });
          }
        }

        if (product.item && product.item !== origItem.item) {
          newItem = await db.Item.findOne({
            where: {
              item: product.item,
              deleted_at: { [Sequelize.Op.is]: null },
            },
          });

          if (!newItem) {
            newItem = await db.Item.create({
              item: product.item,
            });
          }
        }

        // eslint-disable-next-line no-param-reassign
        product.TypeId = newType.id;
        // eslint-disable-next-line no-param-reassign
        product.ItemId = newItem.id;

        const res = await db.Product.update(product, {
          where: { id },
          returning: true,
        });

        // console.log(`DEBUG: Product updated: ${JSON.stringify(res[1][0])}`);
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

    findProduct: async (product) => {
      try {
        if (!product) {
          throw new Error('ERROR: No product id defined');
        }

        const res = await db.Product.findOne({
          where: {
            pricevalue: product.pricevalue,
            deleted_at: { [Sequelize.Op.is]: null },
          },
          include: [
            {
              model: db.Item,
              where: { item: product.item },
            },
            {
              model: db.Type,
              where: { type: product.type },
            },
          ],
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    findUser: async (email) => {
      try {
        const res = await db.User.findOne({
          where: {
            email,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    createUser: async (user) => {
      try {
        // const usr = JSON.parse(JSON.stringify(user));

        const res = await db.User.create({
          email: user.email,
          password: user.password,
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    createOrder: async (UserId) => {
      try {
        const res = await db.Order.create({
          UserId,
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    getOrder: async (order) => {
      try {
        const res = await db.Order.findOne({
          where: order,
          deleted_at: { [Sequelize.Op.is]: null },
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    createOrderItem: async (orderItem) => {
      try {
        const res = await db.OrderItem.create(orderItem);

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    findOrderItem: async (orderItem) => {
      const { OrderId, ProductId } = orderItem;
      try {
        const res = await db.OrderItem.findOne({
          where: {
            OrderId,
            ProductId,
            deleted_at: { [Sequelize.Op.is]: null },
          },
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    findOrderItems: async (OrderId) => {
      try {
        const res = await db.OrderItem.findAll({
          where: OrderId,
          deleted_at: { [Sequelize.Op.is]: null },
          include: [
            {
              model: db.Product,
              include: [
                {
                  model: db.Item,
                },
                {
                  model: db.Type,
                },
              ],
            },
          ],
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    updateOrderItem: async ({ id, ...orderItem }) => {
      try {
        const res = await db.OrderItem.update(orderItem, {
          where: { id },
          returning: true,
        });

        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    updateUser: async ({ id, ...user }) => {
      try {
        const res = await db.User.update(user, {
          where: { id },
          returning: true,
        });
        return res;
      } catch (err) {
        console.error(err.message || err);
        throw err;
      }
    },

    //
  };
};
