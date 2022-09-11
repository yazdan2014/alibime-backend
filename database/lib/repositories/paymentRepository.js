const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class paymentRepository {
  constructor() {
    this.add = function (item, callback) {
      try {
        databaseManager.database
          .collection("payments")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new Payment done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };
    this.getByOrderId = function (orderid, callback) {
      try {
        // let o_id = orderid;

        databaseManager.database.collection("payments").findOne(
          {
            orderId: orderid,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get payment by OrderId done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };
    this.getByTransId = function (transid, callback) {
      try {
        // let o_id = orderid;

        databaseManager.database.collection("payments").findOne(
          {
            transactionId: transid,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get payment by TransId done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };
    this.getByPayId = function (payid, callback) {
      try {
        // let o_id = orderid;

        databaseManager.database.collection("payments").findOne(
          {
            paymentId: payid,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get payment by PayId done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };
    this.gets = function (accountId, skip, limit, callback) {
      try {
        let o_accountId = new mongodb.ObjectID(accountId);

        databaseManager.database
          .collection("payments")
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
            logger.log_info("gets payments done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };
    this.update = function (payId, accountId, modifiedFields, callback) {
      try {
        let o_id = payId;
        let o_accountId = new mongodb.ObjectID(accountId);
        let query = {
          $and: [{ paymentId: o_id }, { accountId: o_accountId }],
        };
        delete modifiedFields.paymentId;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("payments")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update payment done");
                return callback(null, res);
              }
              logger.log_info("no payment was updated");
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

module.exports = paymentRepository;
