const http = require('http');

const requestHandler = require('./server/requestHandler');

const PORT = 3000;

const server = http.createServer(requestHandler);

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

enableGracefulExit();
server.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
