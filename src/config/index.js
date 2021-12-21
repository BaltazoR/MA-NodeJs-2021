require('dotenv').config();

const server = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || 'localhost',
};

const auth = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
};

module.exports = {
  server,
  auth,
};
