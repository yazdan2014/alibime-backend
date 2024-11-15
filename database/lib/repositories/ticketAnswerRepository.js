const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class ticketRepository {
  constructor() {
    //-------------------------------------------------------------------------------
    this.getsAnswers = function (ticketId ,accountId, skip, limit, callback) {
      try {
        let o_accountId = new mongodb.ObjectID(accountId);
        let o_ticketId = new mongodb.ObjectID(ticketId);

        databaseManager.database
          .collection("ticketAnswers")
          .find({
            $and: [{ authorId: o_accountId }, { deleted: { $ne: true } }, {ticketId: o_ticketId}],
          })
          .limit(Number(limit))
          .skip(Number(skip))
          .sort({ requestDate: 1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets ticket answers done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.addAnswer = function (item, callback) {
      try {
        databaseManager.database
          .collection("ticketAnswers")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new ticket answer done");
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

        databaseManager.database.collection("ticketAnswers").findOne(
          {
            _id: o_id,
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get ticket answer by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };
  }
}

module.exports = ticketRepository;
