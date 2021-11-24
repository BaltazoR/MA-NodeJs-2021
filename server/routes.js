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

  if (pathname === '/commonprice' && method === 'GET')
    return controllers.commonPrice(req, res);

  if (pathname === '/commonprice' && method === 'POST')
    return controllers.commonPricePost(req, res);

  if (pathname === '/data' && method === 'POST')
    return controllers.modifyDataJson(req, res);

  if (
    pathname === '/discount/promise' &&
    (method === 'GET' || method === 'POST')
  )
    return controllers.myPromise(req, res);

  if (
    pathname === '/discount/promisify' &&
    (method === 'GET' || method === 'POST')
  )
    return controllers.myPromisify(req, res);

  return controllers.notFound(req, res);
};
