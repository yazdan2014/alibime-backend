"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");

const tickets = require("database").tickets;
const ticketAnswers = require("database").ticketAnswers;
const ticketModel = require("database").ticketModel;
const ticketAnswersModel = require("database").ticketAnswersModel;

const logger = require("infrastructure").logger;

const { dateHelper } = require("infrastructure");
const { enumHelper } = require("infrastructure");

exports.getTicket = function (req, res) {
  try {
    if (!req.params._id) return apiResponse.sendBadRequest(res);
    authManager.authentication(req, res, function (accountId) {
      let ticketId = req.params._id;
      tickets.get(ticketId, function (error, result) {
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

exports.getList = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 2000;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      tickets.getList(skip, limit, function (error, result) {
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
    if (
      !req.body.orderId ||
      !req.body.title ||
      !req.body.text ||
      !req.body.attachmentsURL
    )
      return apiResponse.sendBadRequest(res);
    logger.log_info("chhanges");
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
//------------------------------------------------------------
exports.getsTicketAnswers = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      ticketAnswers.getsAnswers(
        accountId,
        skip,
        limit,
        function (error, result) {
          if (error) {
            apiResponse.sendInternalError(res, error);
          } else {
            apiResponse.sendSucces(res, result);
          }
        }
      );
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.addNewTicketAnswer = function (req, res) {
  try {
    if (!req.body) return apiResponse.sendBadRequest(res);
    if (!req.body.ticketId || !req.body.text || !req.body.attachmentsURL)
      return apiResponse.sendBadRequest(res);

    authManager.authentication(req, res, function (accountId) {
      let newTicketAnswer = new ticketAnswersModel(
        req.body.ticketId,
        accountId,
        "admin",
        req.body.text,
        req.body.attachmentsURL
      );

      ticketAnswers.addAnswer(newTicketAnswer, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          ticketAnswers.get(result.insertedId, function (error, result) {
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
