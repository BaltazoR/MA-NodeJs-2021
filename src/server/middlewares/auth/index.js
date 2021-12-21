const { auth: basicAuth } = require('../../../config');

const auth = (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  if (
    username &&
    password &&
    username === basicAuth.username &&
    password === basicAuth.password
  ) {
    return next();
  }

  return next(new Error(403));
};

module.exports = auth;
