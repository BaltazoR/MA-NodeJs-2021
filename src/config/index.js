require('dotenv').config();
const { fatal } = require('../utils');

const server = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
};

const auth = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

const db = {
  user: process.env.DB_USER || fatal('FATAL: DB_USER is no defined'),
  host: process.env.DB_HOST || fatal('FATAL: DB_HOST is no defined'),
  port: process.env.DB_PORT || fatal('FATAL: DB_PORT is no defined'),
  database: process.env.DB_NAME || fatal('FATAL: DB_NAME is no defined'),
  password: process.env.DB_PASS || fatal('FATAL: DB_PASS is no defined'),
};

module.exports = {
  server,
  auth,
  db,
};
