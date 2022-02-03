require('@babel/register');
/* eslint-disable no-console */
const chalk = require('chalk');
const dotenv = require('dotenv');
const app = require('./app');
const { initIO } = require('./src/libs/socket');

// Setup an express server and define port to listen all incoming requests for this application
const setUpExpress = () => {
  dotenv.config({ path: '.env' });

  const port = process.env.APP_PORT || 8000;

  const server = app.listen(port, () => {
    console.log(`App running on port ${chalk.greenBright(port)}...`);
  });

  initIO(server);

  // // In case of an error
  // app.on('error', (appErr, appCtx) => {
  //   console.error('app error', appErr.stack);
  //   console.error('on url', appCtx.req.url);
  //   console.error('with headers', appCtx.req.headers);
  // });

  // // Handle unhandled promise rejections
  // process.on('unhandledRejection', err => {
  //   console.log(chalk.bgRed('UNHANDLED REJECTION! 💥 Shutting down...'));
  //   console.log(err.name, err.message);
  //   // Close server & exit process
  //   server.close(() => {
  //     process.exit(1);
  //   });
  // });

  // process.on('SIGTERM', () => {
  //   console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  //   server.close(() => {
  //     console.log('💥 Process terminated!');
  //   });
  // });
};

const serverOnlineMode = isOnline => {
  if (isOnline) {
    setUpExpress();
  } else {
    setUpExpress();
  }
};

if (process.env.NODE_ENV === 'production') {
  serverOnlineMode(true);
} else {
  serverOnlineMode(false);
}
