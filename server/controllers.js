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
  const { message, code } = services.filterPost(JSON.parse(req.body));
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
  const { message, code } = services.topPricePost(JSON.parse(req.body));
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
  const { message, code } = services.commonPricePost(JSON.parse(req.body));
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = code;
  res.write(JSON.stringify({ message }));
  res.end();
}

function modifyDataJson(req, res) {
  const { message, code } = services.modifyDataJson(JSON.parse(req.body));
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
