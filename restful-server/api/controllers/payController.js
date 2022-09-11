"use strict";

const apiResponse = require("../apiResponse");
const logger = require("infrastructure").logger;
const payments = require("database").payments;
const orders = require("database").orders;
const payNewModel = require("database").payNewModel;
const orderEditModel = require("database").orderEditStatusModel;
const payUpdateModel = require("database").payUpdateModel;
const authManager = require("../authManager");
const request = require("request-promise");

exports.goToPayment = function (req, res) {
  try {
    if (!req.body.orderId) return apiResponse.sendBadRequest(res);

    let orderId = req.body.orderId;
    let amount = req.body.amount;
    let name = req.body.fullName;
    let phone = req.body.mobile;
    let email = req.body.email;
    let desc = req.body.desc;

    var options = {
      method: "POST",
      url: "https://api.idpay.ir/v1.1/payment",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "c7ddc000-69e6-4175-997d-cb8c30aad153",
        "X-SANDBOX": 0,
      },
      body: {
        order_id: orderId,
        amount: amount,
        name: name,
        phone: phone,
        mail: email,
        desc: desc,
        // callback: "https://alibime.co/payment/callback/",
        // callback: "http://localhost:3000/payment/callback",
        callback: process.env.ALIBIME_GATEWAY_CALLBACK,
      },
      json: true,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (error) {
        apiResponse.sendInternalError(res, error);
      } else {
        authManager.authentication(req, res, function (accountId) {
          logger.log_info(body);
          let transactionId = createPaymentCode();
          let orderId = req.body.orderId;
          let amount = req.body.amount;
          let name = req.body.fullName;
          let phone = req.body.mobile;
          let email = req.body.email;
          let desc = req.body.desc;
          let paymentId = body.id;
          let status = req.body.status;
          let payRes = new payNewModel(
            accountId,
            paymentId,
            transactionId,
            orderId,
            amount,
            name,
            phone,
            email,
            desc,
            status,

            new Date()
          );
          logger.log_info(payRes);
          payments.add(payRes, function (error, result) {
            if (error) {
              // apiResponse.sendInternalError(res, error);
              logger.log_info("error add new Payment!");
            } else {
              payments.getByPayId(result.paymentId, function (error, result) {
                if (error) {
                  logger.log_info("error add new Payment!");
                  // return apiResponse.sendInternalError(res, error);
                }
                //   if (!result) return apiResponse.sendNotFound(res);
                //   // return apiResponse.sendSucces(res, result);
              });
            }
          });

          return apiResponse.sendSucces(res, body);
        });
      }

      console.log(body);
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.verifyPayment = function (req, res) {
  try {
    if (!req.body.orderId && !req.params.id)
      return apiResponse.sendBadRequest(res);

    var options = {
      method: "POST",
      url: "https://api.idpay.ir/v1.1/payment/verify",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "c7ddc000-69e6-4175-997d-cb8c30aad153",
        "X-SANDBOX": 0,
      },
      body: {
        id: req.body.id,
        order_id: req.body.orderId,
      },
      json: true,
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (error) {
        apiResponse.sendInternalError(res, error);
      }
      if (body.error_code) {
        apiResponse.sendNotAccessed(res, body);
      } else {
        try {
          authManager.authentication(req, res, function (accountId) {
            let status = req.body.status;
            let paymentId = req.body.id;
            logger.log_info(status);
            let updatePayment = new payNewModel(
              accountId,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              status,
              null,
              new Date()
            );

            payments.update(
              paymentId,
              accountId,
              updatePayment,
              function (error, result) {
                if (error) {
                  apiResponse.sendInternalError(res, error);
                } else {
                  payments.getByPayId(paymentId, function (error, result) {
                    if (error) {
                      logger.log_info("error update new Payment!");
                      return apiResponse.sendInternalError(res, error);
                    }
                    if (!result) return apiResponse.sendNotFound(res);
                    logger.log_info("error update new Payment!");
                    return apiResponse.sendSucces(res, result);
                  });
                }
              }
            );
            // let status = req.body.status;
            let orderId = req.body.orderId;
            logger.log_info(orderId);
            // let updateOrder = new orderEditModel(
            //   status,

            //   accountId,
            //   new Date()
            // );
            orders.updateStatus(
              orderId,
              status,
              // updateOrder,
              function (error, result) {
                if (error) {
                  apiResponse.sendInternalError(res, error);
                } else {
                  orders.getById(orderId, function (error, result) {
                    if (error) {
                      return apiResponse.sendInternalError(res, error);
                    }
                    if (!result) return apiResponse.sendNotFound(res);

                    return apiResponse.sendSucces(res, result);
                  });
                }
              }
            );
          });
        } catch (error) {
          apiResponse.sendInternalError(res, error);
          logger.log_error(error);
        }
      }

      console.log(body);
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.getPayments = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      payments.gets(accountId, skip, limit, function (error, result) {
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

exports.getPaymentById = function (req, res) {
  try {
    logger.log_error(req.body.id);
    if (!req.body.id && !req.body.orderId)
      return apiResponse.sendBadRequest(res);
    authManager.authentication(req, res, function (accountId) {
      let payId = req.body.id;
      payments.getByPayId(payId, function (error, result) {
        if (error) {
          logger.log_error(payId);
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

function createPaymentCode() {
  // return Math.floor(Math.random().toString(10).substr(4, 6));
  return Math.random().toString(10).substr(4, 6).toUpperCase();
}
