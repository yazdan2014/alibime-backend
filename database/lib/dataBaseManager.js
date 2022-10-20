"use strict";
let format = require("util").format;
let logger = require("infrastructure").logger;
let mongo = require("mongodb");

var Singleton = (function () {
  var instance;

  function createInstance() {
    var object = new databaseManager();
    return object;
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

function databaseManager() {
  this.connected = false;
  this.client = null;
  this.database = null;

  //public methods
  this.connect = function () {
    return new Promise((resolve, reject) => {
      try {
        // let user = encodeURIComponent(
        //   process.env.ALIBIME_REST_SERVER_MONGOD_USER
        // );
        // let password = encodeURIComponent(
        //   process.env.ALIBIME_REST_SERVER_MONGOD_PASS
        // );
        // let url = encodeURIComponent(
        //   process.env.ALIBIME_REST_SERVER_MONGOD_URL
        // );
        // let dbname = encodeURIComponent(
        //   process.env.ALIBIME_REST_SERVER_MONGOD_DATABASE_NAME
        // );
        let user = String(process.env.ALIBIME_REST_SERVER_MONGOD_USER);
        let password = String(
          process.env.ALIBIME_REST_SERVER_MONGOD_PASS
        );
        let url = String(process.env.ALIBIME_REST_SERVER_MONGOD_URL);
        let dbname = String(
          process.env.ALIBIME_REST_SERVER_MONGOD_DATABASE_NAME
        );
        let inDebug = process.env.ALIBIME_DEBUG;
        let connectToContainer =
          process.env.ALIBIME_DEBUG_CONNECT_TO_CONTAINER;

        let mongoServerUrl;
          mongoServerUrl = "mongodb://root:4N9MKqHuy32cZYxjJto6U1HY@gina.iran.liara.ir:34517/my-app?authSource=admin"
        // if (inDebug) {
        //   if (connectToContainer) {
        //     mongoServerUrl = format(
        //       "mongodb://%s:%s@%s/%s?directConnection=true",
        //       user,
        //       password,
        //       url,
        //       dbname
        //     );
        //   }
        // } else {
        //   mongoServerUrl = format(
        //     "mongodb://%s:%s@%s/%s?directConnection=true",
        //     user,
        //     password,
        //     url,
        //     dbname
        //   );

        //   // mongoServerUrl = format(
        //   //   "mongodb+srv://%s:%s@%s/%s?retryWrites=true&w=majority",
        //   //   user,
        //   //   password,
        //   //   url,
        //   //   dbname
        //   // );
        // }

        mongo.connect(
          mongoServerUrl,
          {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          },
          (err, client) => {
            if (err) {
              logger.log_error(err)
              logger.log_error("can not connect to database");
              this.connected = false;
              this.client = null;
              this.database = null;
              reject(err);
            } else {
              this.connected = true;
              this.client = client;
              this.database = client.db(dbname);
              logger.log_info("connected to database");
              resolve();
            }
          }
        );
      } catch (error) {
        logger.log_error(error);
        reject(error);
      }
    });
  };
  this.disconnect = function () {
    return new Promise((resolve, reject) => {
      try {
        if (this.client) {
          this.client.close();
          this.connected = false;
          this.client = null;
          this.database = null;
          logger.log_info("disconnected from database");
          resolve();
        } else {
          resolve();
        }
      } catch (error) {
        logger.log_error(error);
        reject(error);
      }
    });
  };
}

module.exports = Singleton;
