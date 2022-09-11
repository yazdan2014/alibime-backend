"use strict";

module.exports = function (app) {
  const payController = require("../controllers/payController");

  app.route("/v1/payment/gopayment").post(payController.goToPayment);
  app.route("/v1/payment/verify").post(payController.verifyPayment);
  app.route("/v1/payment/getbyid").post(payController.getPaymentById);
  app.route("/v1/payment").get(payController.getPayments);
};
