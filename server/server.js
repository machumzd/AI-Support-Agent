const app = require('./src/app');
const { connectDB } = require('./src/config/db');
const config = require('./src/config/env');

const start = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`Server listening on http://localhost:${config.port} [${config.env}]`);
  });

  const shutdown = () => {
    console.log('\nShutting down server gracefully...');
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start();
