"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");

exports.get = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      apiResponse.sendSucces(res, {
        Hello: "Hello",
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
