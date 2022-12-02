'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('database');
const logger = require('infrastructure').logger;

const app = express();

const port = process.env.ALIBIME_API_SERVER_PORT;
const host = process.env.ALIBIME_API_SERVER_HOST;

const corsOptions = {
  origin: String(process.env.ALIBIME_ORIGINS_STRING).split(','),
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: [
    'Access-Control-Allow-Headers',
    'X-Requested-With',
    'X-Access-Token',
    'Content-Type',
    'Host',
    'Accept',
    'Connection',
    'Cache-Control',
  ],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const adminRoutes = require('./api/routes/adminRoutes');
const accountRoutes = require('./api/routes/accountRoutes');
const reminderRoutes = require('./api/routes/reminderRoutes');
const orderRoutes = require('./api/routes/orderRoutes');
const carRoutes = require('./api/routes/carRoutes');
const offerRoutes = require('./api/routes/offerRoutes');
const payRoutes = require('./api/routes/payRoutes');
const testRoutes = require('./api/routes/testRoutes');
const ticketRoutes = require('./api/routes/ticketRoutes');

function restfulServer() {
  initial();
  this.startListening = startListening;
}

function initial() {
  try {
    connectToDatabase();
    initAllowHeaders();
    initBodyParser();
    registerRoutes();
  } catch (err) {
    logger.log_error(err);
  }
}

function connectToDatabase(count = 0) {
  return new Promise((resolve) => {
    database
      .connect()
      .then(() => {
        return resolve();
      })
      .catch((err) => {
        err = err;
        console.log('try to connect ... ' + count);
        return resolve(connectToDatabase(++count));
      });
  });
}

function initBodyParser() {
  logger.log_info('Initing body parser');
  app.use(
    bodyParser.json({
      limit: '50mb',
    })
  );
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: '50mb',
    })
  );
}

function initAllowHeaders() {
  logger.log_info('Initing allowed headers');
  app.use(cors(corsOptions));
}

function registerRoutes() {
  logger.log_info('Registering routes');

  adminRoutes(app);
  accountRoutes(app);
  reminderRoutes(app);
  orderRoutes(app);
  carRoutes(app);
  offerRoutes(app);
  payRoutes(app);
  testRoutes(app);
  ticketRoutes(app);
}

var startListening = function () {
  try {
    app.listen(port, host, () =>
      logger.log_info('Listening on: http://' + host + ':' + port)
    );
    // app.listen(port, () =>
    //   logger.log_info("Listening on: http://127.0.0.1:" + port)
    // );
  } catch (error) {
    logger.log_error(error);
  }
};

module.exports = new restfulServer();
