const jwt = require('jsonwebtoken');

const {
  server: {
    token: { SECRET_KEY },
  },
} = require('../../../config');

const auth = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error(401));
    }

    const decoded = jwt.verify(token, SECRET_KEY, (err, resp) => {
      if (err?.message === 'jwt expired') return err.message;
      return resp;
    });

    if (decoded === 'jwt expired') return next(new Error(decoded));

    if (decoded?.type === 'refresh') return next(new Error('refresh'));

    req.user = { id: decoded.id, username: decoded.email };
    return next();
  } catch (e) {
    return next(new Error(401));
  }
};

module.exports = auth;
