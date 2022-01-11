const http = require('http');

const config = require('./config');
const app = require('./app');

const db = require('./db');

// const requestHandler = require('./server/requestHandler');

// const server = http.createServer(requestHandler);
const server = http.createServer(app);

function enableGracefulExit() {
  const exitHandler = (error) => {
    if (error) console.error(error.message || error);

    console.log('⏱  Server gracefully stopping ...');

    server.close(async (err) => {
      if (err) console.error(err.message || err, 'Failed to close server!');
      console.log('✅ Server has been stopped.');
      await db.close();
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
  try {
    await db.init();

    server.listen(config.server.PORT, () => {
      console.log(
        // eslint-disable-next-line max-len
        `Server successfully started on port ${config.server.PORT} on host ${config.server.HOST}`,
      );
    });
  } catch (err) {
    console.error(`ERROR in boot(): ${err.message || err}`);
  }
};

boot();
