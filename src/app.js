const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

const { auth, errorHandler } = require('./server/middlewares');

const app = express();

app.use(auth);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json({ type: 'application/json' }));

app.use(bodyParser.raw({ type: 'text/csv', limit: '10mb' }));

app.use('/', routes.filters);
app.use('/', routes.crud);
app.use('/discount', routes.discount);
app.use('/data', routes.data);

app.use((req, res, next) => {
  next(new Error(404));
});

app.use(errorHandler);

module.exports = app;
