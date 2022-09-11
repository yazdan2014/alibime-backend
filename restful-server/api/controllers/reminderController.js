"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const reminders = require("database").reminders;
const reminderModel = require("database").reminderModel;
const reminderEditRedSectionModel = require("database")
  .reminderEditRedSectionModel;
const logger = require("infrastructure").logger;

exports.getsAllReminders = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      reminders.gets(accountId, skip, limit, function (error, result) {
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

exports.addNewReminder = function (req, res) {
  try {
    if (!req.body.dueDate) return apiResponse.sendBadRequest(res);
    authManager.authentication(req, res, function (accountId) {
      let newReminder = new reminderModel(
        accountId,
        req.body.insuranceType,
        req.body.cycle,
        req.body.description,
        req.body.province,
        req.body.city,
        req.body.dueDate,
        req.body.status,

        null,
        accountId,
        null,
        new Date(),
        null
      );

      reminders.add(newReminder, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          reminders.get(result.insertedId, function (error, result) {
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

exports.updateReminder = function (req, res) {
  try {
    if (!req.body._id) return apiResponse.sendBadRequest(res);

    authManager.authentication(req, res, function (accountId) {
      let reminderId = req.body._id;
      let updateReminder = new reminderModel(
        null,
        req.body.insuranceType,
        req.body.cycle,
        req.body.description,
        req.body.province,
        req.body.city,
        req.body.dueDate,
        req.body.status,

        null,
        null,
        accountId,
        null,
        new Date()
      );

      reminders.update(reminderId, accountId, updateReminder, function (
        error,
        result
      ) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          reminders.get(reminderId, function (error, result) {
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
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.deleteReminder = function (req, res) {
  try {
    if (!req.params._id) return apiResponse.sendBadRequest(res);

    authManager.authentication(req, res, function (accountId) {
      let reminderId = req.params._id;
      let reminderEditRedSection = new reminderEditRedSectionModel(
        true,
        null,
        accountId,
        null,
        new Date()
      );

      reminders.update(reminderId, accountId, reminderEditRedSection, function (
        error,
        result
      ) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          return apiResponse.sendSucces(res);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
