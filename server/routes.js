const controllers = require('./controllers');

module.exports = (req, res) => {
  const { pathname, method } = req;

  if (pathname === '/filter' && method === 'GET')
    return controllers.filter(req, res);

  if (pathname === '/filter' && method === 'POST')
    return controllers.filterPost(req, res);

  if (pathname === '/topprice' && method === 'GET')
    return controllers.topPrice(req, res);

  if (pathname === '/topprice' && method === 'POST')
    return controllers.topPricePost(req, res);

  return controllers.notFound(req, res);
};
