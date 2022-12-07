const databaseManager = require('../dataBaseManager').getInstance();
const logger = require('infrastructure').logger;
const mongodb = require('mongodb');

class ticketRepository {
  constructor() {
    this.add = function (item, callback) {
      try {
        databaseManager.database
          .collection('tickets')
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info('add new ticket done');
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.get = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);

        databaseManager.database.collection('tickets').findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info('get ticket by id done');
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getList = function (skip, limit, callback) {
      try {
        databaseManager.database
          .collection("tickets")
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
            logger.log_info("gets tickets list done");
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
            .collection("tickets")
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
              logger.log_info("gets tickets done");
              callback(null, res);
            });
        } catch (error) {
          logger.log_error(error);
          callback(error, null);
        }
      };
  }
}

module.exports = ticketRepository;
