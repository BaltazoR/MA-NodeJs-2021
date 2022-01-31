const jwt = require('jsonwebtoken');

const {
  server: {
    token: { SECRET_KEY },
  },
} = require('../../../config');

const db = require('../../../db');

const auth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error(401));
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await db.findUser(decoded.email);

    if (user.token === token) {
      req.user = { id: decoded.id, username: decoded.email };
      return next();
    }

    return next(new Error(401));
  } catch (e) {
    return next(new Error(401));
  }
};

module.exports = auth;
