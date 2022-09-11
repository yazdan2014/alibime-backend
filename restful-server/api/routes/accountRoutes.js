"use strict";

module.exports = function (app) {
  const accountController = require("../controllers/accountController");

  app.route("/v1/account/getAll").get(accountController.getAllAccounts);
  app
    .route("/v1/account/getAllAccessed")
    .get(accountController.getAllAccessedAccounts);
  app.route("/v1/account/otp/moblie").post(accountController.sendOtpBySms);
  app.route("/v1/account/otp/confirm").post(accountController.confirmOtp);
  app.route("/v1/account/logout").post(accountController.logout);
  app.route("/v1/account/info").get(accountController.getInfo);
  app.route("/v1/account/info").put(accountController.editInfo);
  app.route("/v1/account/role").get(accountController.getRole);
  app.route("/v1/account/role").put(accountController.editRole);

  app.route("/v1/account/sendsms").post(accountController.sendSms);
};
