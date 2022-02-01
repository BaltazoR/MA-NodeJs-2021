// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  if (error.message === 'jwt expired') {
    return res.status(401).send({ error: 'Access token expired.' });
  }

  if (error.message === 'refresh') {
    return res.status(401).send({ error: 'Use only access token.' });
  }

  if (error.message === 'access') {
    return res.status(401).send({ error: 'Use only refresh token.' });
  }
  if (error.message === '401') {
    return res.status(401).send({ error: 'Unauthorized.' });
  }

  if (error.message === '403') {
    return res.status(403).send({ error: 'Authentication required.' });
  }

  if (error.message === '404') {
    return res.status(404).send({ message: `Page not found - ${req.path}` });
  }

  return res.status(500).send({ error: `${error.message}` });
};

module.exports = errorHandler;
