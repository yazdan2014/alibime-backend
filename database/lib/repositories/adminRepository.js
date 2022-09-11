const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class adminRepository {
  constructor() {
    this.getsAll = function (skip, limit, callback) {
      try {
        databaseManager.database
          .collection("admins")
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
            logger.log_info("gets all admins done");
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
          .collection("admins")
          .find({
            $and: [{ deleted: { $ne: true } }, { role: { $ne: "admin" } }],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ mobilePhone: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all admins done");
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

        databaseManager.database.collection("admins").findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get admin by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getByUserNamePassword = function (username, password, callback) {
      try {
        let _username = username;
        let _password = password;
        logger.log_info(username);
        databaseManager.database.collection("admins").findOne(
          {
            $and: [
              { username: _username },
              { password: _password },
              { deleted: { $ne: true } },
            ],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            } else if (!res) {
              logger.log_error("username or password incorrect!");
              callback(err, null);
            } else {
              logger.log_info("get admin by username done");
              callback(null, res);
            }
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getByUserName = function (username, callback) {
      try {
        let _username = username;
        logger.log_info(username);
        databaseManager.database.collection("admins").findOne(
          {
            $and: [{ username: _username }, { deleted: { $ne: true } }],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            } else if (!res) {
              logger.log_error("username or password incorrect!");
              callback(err, null);
            } else {
              logger.log_info("get admin by username done");
              callback(null, res);
            }
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getByMobilePhone = function (mobilePhone, callback) {
      try {
        databaseManager.database.collection("admins").findOne(
          {
            mobilePhone: mobilePhone,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get admin by mobile phone done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.addNew = function (item, callback) {
      try {
        databaseManager.database
          .collection("admins")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new admin done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.register = function (item, callback) {};

    this.delete = function (username, callback) {
      try {
        databaseManager.database.collection("admins").deleteOne(
          {
            username: username,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("delete Admin Done!");
            callback(null, res);
          }
        );
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
          .collection("admins")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update admin done");
                return callback(null, true);
              }
              logger.log_info("no admin was updated");
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
          .collection("admins")
          .updateOne(myquery, newvalues, { upsert: true }, function (err, res) {
            try {
              if (err) return callback(err, null);
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update or insert admin done");
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

    this.getsAllOrders = function (skip, limit, callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("orders")
          .find({
            deleted: { $ne: true },
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.getsAllAdmins = function (skip, limit, callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("admins")
          .find({
            deleted: { $ne: true },
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all admins done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.getsAllTrans = function (skip, limit, callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("payments")
          .find({
            deleted: { $ne: true },
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all transactions done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.gets24Orders = function (callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("orders")
          .find({
            createdDate: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          })
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            // logger.log_info("gets all 24H Orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.gets24Trans = function (callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("payments")
          .find({
            createdDate: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          })
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            // logger.log_info("gets all 24H Orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.gets24Acc = function (callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("users")
          .find({
            createdDate: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          })
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            // logger.log_info("gets all 24H Orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.gets24Tickets = function (callback) {
      try {
        // let o_accountId = new mongodb.ObjectID(accountId);
        // let roles = ["superAdmin", "powerAdmin"];

        databaseManager.database
          .collection("tickets")
          .find({
            createdDate: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          })
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            // logger.log_info("gets all 24H Orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };
  }
}

module.exports = adminRepository;
