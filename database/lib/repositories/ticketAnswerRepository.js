const databaseManager = require('../dataBaseManager').getInstance();
const logger = require('infrastructure').logger;
const mongodb = require('mongodb');

class ticketRepository {
  constructor() {
//-------------------------------------------------------------------------------
      this.getsAnswers = function (accountId, skip, limit, callback) {
        try {
          let o_accountId = new mongodb.ObjectID(accountId);
  
          databaseManager.database
            .collection("ticketAnswers")
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
            .collection('ticketsAnswers')
            .insertOne(item, function (err, res) {
              if (err) {
                return callback(err, null);
              }
              logger.log_info('add new ticket answer done');
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
  
          databaseManager.database.collection('ticketAnswers').findOne(
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
  }

  

  
}

module.exports = ticketRepository;
