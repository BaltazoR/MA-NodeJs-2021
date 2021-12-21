const http = require('http');

const config = require('./config');
const app = require('./app');

// const requestHandler = require('./server/requestHandler');

// const server = http.createServer(requestHandler);
const server = http.createServer(app);

function enableGracefulExit() {
  const exitHandler = (error) => {
    if (error) console.error(error);

    console.log('⏱  Server gracefully stopping ...');

    server.close((err) => {
      if (err) console.error(err, 'Failed to close server!');
      console.log('✅ Server has been stopped.');
      process.exit();
    });
  };

  process.on('SIGINT', exitHandler);
  process.on('SIGTERM', exitHandler);

  process.on('SIGUSR1', exitHandler);
  process.on('SIGUSR2', exitHandler);

  process.on('uncaughtException', exitHandler);
  process.on('unhandledRejection', exitHandler);
}

const boot = async () => {
  enableGracefulExit();
  server.listen(config.server.PORT, () => {
    console.log(
      // eslint-disable-next-line max-len
      `Server successfully started on port ${config.server.PORT} on host ${config.server.HOST}`,
    );
  });
};

boot();
