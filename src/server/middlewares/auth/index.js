// const { auth: basicAuth } = require('../../../config');
const db = require('../../../db');

const auth = async (req, res, next) => {
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':');

  const user = await db.findUser(username);

  if (
    username &&
    password &&
    user &&
    username === user.email &&
    password === user.password
  ) {
    // const data = 'Masters:Academy';
    // let buff = Buffer.from(data);
    // const base64data = buff.toString('base64');

    // console.log(base64data);

    // buff = Buffer.from(base64data, 'base64');
    // const text = buff.toString();

    // console.log(text);
    // console.log(req.headers.authorization.split(' ')[1]);

    req.user = { id: user.id, username: user.email };
    return next();
  }

  return next(new Error(403));
};

module.exports = auth;
