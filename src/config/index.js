require('dotenv').config();
const { fatal } = require('../utils');

const server = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
};

const auth = {
  username: process.env.MY_USERNAME,
  password: process.env.PASSWORD,
};

const db = {
  defaultType: process.env.DB_WRAPPER_TYPE || 'sequelize',
  config: {
    pg: {
      user: process.env.DB_USER || fatal('FATAL: DB_USER is no defined'),
      host: process.env.DB_HOST || fatal('FATAL: DB_HOST is no defined'),
      port: process.env.DB_PORT || fatal('FATAL: DB_PORT is no defined'),
      database: process.env.DB_NAME || fatal('FATAL: DB_NAME is no defined'),
      password: process.env.DB_PASS || fatal('FATAL: DB_PASS is no defined'),
    },

    sequelize: {
      dialect: 'postgres',
      username: process.env.DB_USER || fatal('FATAL: DB_USER is no defined'),
      host: process.env.DB_HOST || fatal('FATAL: DB_HOST is no defined'),
      port: process.env.DB_PORT || fatal('FATAL: DB_PORT is no defined'),
      database: process.env.DB_NAME || fatal('FATAL: DB_NAME is no defined'),
      password: process.env.DB_PASS || fatal('FATAL: DB_PASS is no defined'),
      logging: false,
      // quoteIdentifiers: false,
      pool: {
        min: 0,
        max: 10,
        idle: 5000,
        acquire: 5000,
        evict: 5000,
      },
    },
  },
};

module.exports = {
  server,
  auth,
  db,
};
