const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class reminderRepository {
  constructor() {
    this.getsAll = function (skip, limit, callback) {
      try {
        databaseManager.database
          .collection("reminders")
          .aggregate([
            {
              $match: {
                $and: [{ deleted: { $ne: true } }, { status: { $eq: 0 } }],
              },
            },
            { $skip: skip },
            { $limit: limit },
            { $sort: { dueDate: 1 } },
            {
              $lookup: {
                from: "users",
                localField: "accountId",
                foreignField: "_id",
                as: "account",
              },
            },
            {
              $project: {
                mobilePhone: { $arrayElemAt: ["$account.mobilePhone", 0] },
                cycle: "$cycle",
                description: "$description",
                dueDate: "$dueDate",
              },
            },
          ])
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets all reminders done");
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
          .collection("reminders")
          .find({
            $and: [{ accountId: o_accountId }, { deleted: { $ne: true } }],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ dueDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets reminders done");
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

        databaseManager.database.collection("reminders").findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get reminder by id done");
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
          .collection("reminders")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new reminder done");
            callback(null, res);
          });
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
          .collection("reminders")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update reminder done");
                return callback(null, true);
              }
              logger.log_info("no reminder was updated");
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
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        let newvalues = {
          $set: {
            status: status,
          },
        };
        databaseManager.database
          .collection("reminders")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update status reminder done");
                return callback(null, true);
              }
              logger.log_info("no reminder was updated");
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

module.exports = reminderRepository;
