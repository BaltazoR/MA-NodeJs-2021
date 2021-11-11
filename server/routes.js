const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'GET')
    return controllers.filter(req, res);

  if (pathname === '/filter' && method === 'POST')
    return controllers.filterPost(req, res);

  return controllers.notFound(req, res);
};
