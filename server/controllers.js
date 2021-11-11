const services = require('../services');

function notFound(req, res) {
  const { message, code } = services.notFound();
  res.statusCode = code;
  res.write(message);
  res.end();
}

// my
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

module.exports = {
  notFound,
  filter,
  filterPost,
};
