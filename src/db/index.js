const {
  db: { config, defaultType },
} = require('../config');

const { fatal } = require('../utils');

const db = {};

let type = defaultType;

const funcWrapper = (func) =>
  typeof func === 'function'
    ? func
    : fatal(`FATAL: Cannot find ${func.name} function for current DB wrapper`);

const init = async () => {
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const [k, v] of Object.entries(config)) {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const wrapper = require(`./${k}`)(v);
      // eslint-disable-next-line no-await-in-loop
      await wrapper.testConnection();
      console.log(`INFO: DB wrapper for ${k} initiated`);
      db[k] = wrapper;
    }
  } catch (err) {
    fatal(`FATAL: ${err.message || err}`);
  }
};

const end = async () => {
  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(db)) {
    // eslint-disable-next-line no-await-in-loop
    await v.close();
    console.log(`INFO: DB wrapper for ${k} was closed`);
  }
};

const setType = (t) => {
  if (!t || !db[t]) {
    console.log('WARNING: Cannot find provided DB type!');
    return false;
  }
  type = t;
  console.log(`INFO: The DB type has been changed to ${t}`);
  return true;
};

const getType = () => type;

const dbWrapper = (t) => db[t] || db[type];

module.exports = {
  init,
  end,
  setType,
  getType,
  dbWrapper,
  //
  testConnection: async () => funcWrapper(dbWrapper().testConnection)(),
  close: async () => funcWrapper(dbWrapper().close)(),
  // eslint-disable-next-line max-len
  createProduct: async (product) =>
    funcWrapper(dbWrapper().createProduct)(product),
  getProduct: async (id) => funcWrapper(dbWrapper().getProduct)(id),
  getAllProduct: async () => funcWrapper(dbWrapper().getAllProduct)(),
  // eslint-disable-next-line max-len
  updateProduct: async (product) =>
    funcWrapper(dbWrapper().updateProduct)(product),
  deleteProduct: async (id) => funcWrapper(dbWrapper().deleteProduct)(id),
  findProduct: async (product) => funcWrapper(dbWrapper().findProduct)(product),
  findUser: async (email) => funcWrapper(dbWrapper().findUser)(email),
  createUser: async (user) => funcWrapper(dbWrapper().createUser)(user),
  createOrder: async (UserId) => funcWrapper(dbWrapper().createOrder)(UserId),
  getOrder: async (order) => funcWrapper(dbWrapper().getOrder)(order),
  createOrderItem: async (orderItem) =>
    funcWrapper(dbWrapper().createOrderItem)(orderItem),
  findOrderItem: async (orderId) =>
    funcWrapper(dbWrapper().findOrderItem)(orderId),
  findOrderItems: async (orderId) =>
    funcWrapper(dbWrapper().findOrderItems)(orderId),
  updateOrderItem: async (orderItem) =>
    funcWrapper(dbWrapper().updateOrderItem)(orderItem),
};
