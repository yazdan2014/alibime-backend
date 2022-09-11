const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class orderRepository {
  constructor() {
    this.getAllByStatusRange = function (
      statusStart,
      statusEnd,
      skip,
      limit,
      callback
    ) {
      try {
        databaseManager.database
          .collection("orders")
          .find({
            $and: [
              { status: { $gte: statusStart, $lte: statusEnd } },
              { deleted: { $ne: true } },
            ],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.getList = function (skip, limit, callback) {
      try {
        databaseManager.database
          .collection("orders")
          .aggregate([
            { $match: { deleted: { $ne: true } } },
            {
              $lookup: {
                from: "users",
                localField: "accountId",
                foreignField: "_id",
                as: "users",
              },
            },
            {
              $project: {
                _id: 1,
                type: 1,
                status: 1,
                code: 1,
                firstName: { $arrayElemAt: ["$users.firstName", 0] },
                lastName: { $arrayElemAt: ["$users.lastName", 0] },
              },
            },
          ])
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets order list done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.gets = function (accountId, skip, limit, callback) {
      try {
        let o_accountId = new mongodb.ObjectID(accountId);

        databaseManager.database
          .collection("orders")
          .find({
            $and: [{ accountId: o_accountId }, { deleted: { $ne: true } }],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets orders done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.get = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);

        databaseManager.database.collection("orders").findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get order by id done");
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
          .collection("orders")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new order done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.delete = function (id, callback) {
      try {
        let o_id = Number(id);

        databaseManager.database.collection("orders").deleteOne(
          {
            tracking_code: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("delete Order Done!");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.update = function (id, accountId, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let o_accountId = new mongodb.ObjectID(accountId);
        let query = {
          $and: [{ _id: o_id }, { accountId: o_accountId }],
        };
        delete modifiedFields._id;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("orders")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update order done");
                return callback(null, true);
              }
              logger.log_info("no order was updated");
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

    this.getById = function (id, callback) {
      try {
        let o_id = Number(id);

        databaseManager.database.collection("orders").findOne(
          {
            tracking_code: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get order by Tracking-id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateById = function (id, accountId, modifiedFields, callback) {
      try {
        let o_id = String(id);
        let o_accountId = new mongodb.ObjectID(accountId);
        let query = {
          $and: [{ tracking_code: o_id }, { accountId: o_accountId }],
        };
        delete modifiedFields.tracking_code;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("orders")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update order done");
                return callback(null, true);
              }
              logger.log_info("no order was updated");
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

    this.updateStatus = function (id, status, callback) {
      try {
        let o_id = Number(id);
        let query = { tracking_code: o_id };
        let newvalues = {
          $set: {
            status: status,
          },
        };
        databaseManager.database
          .collection("orders")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update status order done");
                return callback(null, true);
              }
              logger.log_info("no order was updated status");
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

    this.updateImagesUrl = function (id, status, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        let newvalues = {
          $set: {
            status: status,
          },
        };
        databaseManager.database
          .collection("orders")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update status order done");
                return callback(null, true);
              }
              logger.log_info("no order was updated");
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

module.exports = orderRepository;
