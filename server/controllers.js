const services = require('../services');

function notFound(req, res) {
  const { message, code } = services.notFound();
  res.statusCode = code;
  res.write(message);
  res.end();
}

function filter(req, res) {
  const { message, code } = services.filter(req.params);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function filterPost(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req.body,
    services.filterPost,
  );

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function topPrice(req, res) {
  const { message, code } = services.topPrice(req.params);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function topPricePost(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req.body,
    services.topPricePost,
  );

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function commonPrice(req, res) {
  const { message, code } = services.commonPrice(req.params);
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function commonPricePost(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req.body,
    services.commonPricePost,
  );

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function modifyDataJson(req, res) {
  const { message, code } = services.bodyRequestIsEmpty(
    req.body,
    services.modifyDataJson,
  );

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

module.exports = {
  notFound,
  filter,
  filterPost,
  topPrice,
  topPricePost,
  commonPrice,
  commonPricePost,
  modifyDataJson,
};
