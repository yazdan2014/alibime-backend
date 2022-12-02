'use strict';

const apiResponse = require('../apiResponse');
const authManager = require('../authManager');

const tickets = require('database').tickets;
const ticketModel = require('database').ticketModel;
const ticketAnswersModel = require('database').ticketAnswersModel;

const logger = require('infrastructure').logger;

const { dateHelper } = require('infrastructure');
const { enumHelper } = require('infrastructure');

exports.getsTickets = function (req, res) {
  try {
    
    authManager.authentication(req, res, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      tickets.gets(accountId, skip, limit, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          apiResponse.sendSucces(res, result);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.addNewTicket = function (req, res) {
  try {
    if (!req.body) return apiResponse.sendBadRequest(res);
    if (!req.body.orderId || !req.body.title || !req.body.text || !req.body.attachmentsURL) return apiResponse.sendBadRequest(res);

    authManager.authentication(req, res, function (accountId) {
      let newTicket = new ticketModel(
        getInsuranceCode(),
        accountId,
        req.body.orderId,
        req.body.title,
        req.body.text,
        req.body.attachmentsURL,
        "در انتظار پاسخ"
      );

      tickets.add(newTicket, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          tickets.get(result.insertedId, function (error, result) {
            if (error) {
              return apiResponse.sendInternalError(res, error);
            }
            if (!result) return apiResponse.sendNotFound(res);
            return apiResponse.sendSucces(res, result);
          });
        }
      });
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

function getInsuranceCode() {
  // return Math.floor(Math.random().toString(10).substr(4, 6));
  return Math.random().toString(10).substr(5, 6).toUpperCase();
}