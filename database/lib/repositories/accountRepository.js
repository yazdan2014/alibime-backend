const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class accountRepository {
  constructor() {
    this.getsAll = function (skip, limit, callback) {
      try {
        databaseManager.database
          .collection("users")
          .find({
            $and: [{ deleted: { $ne: true } }],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ mobilePhone: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all accounts done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.getsAccessedAll = function (skip, limit, callback) {
      try {
        databaseManager.database
          .collection("users")
          .find({
            $and: [{ deleted: { $ne: true } }, { role: { $ne: "user" } }],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ mobilePhone: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all accounts done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.get = function (_id, callback) {
      try {
        let o_id = new mongodb.ObjectID(_id);

        databaseManager.database.collection("users").findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get account by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getByMobilePhone = function (mobilePhone, callback) {
      try {
        databaseManager.database.collection("users").findOne(
          {
            mobilePhone: mobilePhone,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get account by mobile phone done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.add = function (item, callback) {
      try {
        databaseManager.database
          .collection("users")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new account done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.update = function (id, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        delete modifiedFields._id;
        delete modifiedFields.mobilePhone;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("users")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update account done");
                return callback(null, true);
              }
              logger.log_info("no account was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.updateOrInsertByMobilePhone = function (mobilePhone, callback) {
      try {
        let myquery = {
          mobilePhone: mobilePhone,
        };
        let newvalues = {
          $set: {
            mobilePhone: mobilePhone,
          },
        };
        databaseManager.database
          .collection("users")
          .updateOne(myquery, newvalues, { upsert: true }, function (err, res) {
            try {
              if (err) return callback(err, null);
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update or insert account done");
                return callback(null, true);
              }
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };
  }
}

module.exports = accountRepository;
