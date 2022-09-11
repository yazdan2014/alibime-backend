"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const users = require("database").users;
const accountModel = require("database").accountModel;
const accountEditRoleModel = require("database").accountEditRoleModel;
const smsHelper = require("infrastructure").smsHelper;
const logger = require("infrastructure").logger;
const bcrypt = require("bcrypt");

exports.getAllAccounts = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      users.getsAll(skip, limit, function (error, result) {
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

exports.getAllAccessedAccounts = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      users.getsAccessedAll(skip, limit, function (error, result) {
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

exports.sendSms = function (req, res) {
  try {
    if (!req.body.mobilePhone) apiResponse.sendBadRequest(res);
    else {
      let mobilePhone = String(req.body.mobilePhone);
      let text = String(req.body.text);
      smsHelper
        .sendSMS(mobilePhone, text)
        .then((result) => {
          apiResponse.sendSucces(res, result);
        })
        .catch((error) => {
          apiResponse.sendInternalError(res, error);
          logger.log_error(error);
        });
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.sendOtpBySms = function (req, res) {
  try {
    if (!req.body.mobilePhone) apiResponse.sendBadRequest(res);
    else {
      let mobilePhone = String(req.body.mobilePhone);

      let code = getVerifyUniqCode();
      let hashedCode = bcrypt.hashSync(code, 5);
      authManager.signTemp(
        mobilePhone,
        hashedCode,
        res,
        function (tempToken, expire) {
          // send sms
          smsHelper
            .sendOTP(mobilePhone, code)
            .then((result) => {
              apiResponse.sendSucces(res, {
                tempToken: tempToken,
                expire: expire,
              });
            })
            .catch((error) => {
              apiResponse.sendInternalError(res, error);
              logger.log_error(error);
            });
        }
      );
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.confirmOtp = function (req, res) {
  try {
    if (
      !req.body.mobilePhone ||
      !req.body.confirmationCode ||
      !req.body.tempToken
    ) {
      apiResponse.sendBadRequest(res);
    } else {
      let mobilePhone = String(req.body.mobilePhone);
      let confirmationCode = String(req.body.confirmationCode);
      let tempToken = String(req.body.tempToken);

      authManager.authenticationTemp(tempToken, res, function (decode) {
        // if confirmationcode not decoded
        // if (String(decode.code) !== confirmationCode)
        if (!bcrypt.compareSync(confirmationCode, decode.code))
          return apiResponse.sendUnAuthorized(res, "کد صحیح نیست!");
        if (String(decode.mobilePhone) !== mobilePhone)
          return apiResponse.sendUnAuthorized(
            res,
            "اطلاعات وارد شده صحیح نیست."
          );

        users.getByMobilePhone(mobilePhone, function (error, account) {
          if (error) {
            apiResponse.sendInternalError(res, error);
          } else {
            if (account) {
              // sign
              authManager.sign(
                account._id,
                account.role,
                res,
                function (token, expire) {
                  apiResponse.sendSucces(res, {
                    "X-Access-Token": token,
                    "X-Expires-After": expire,
                  });
                }
              );
            } else {
              // add and sign
              let newAccount = new accountModel(
                mobilePhone,
                "user",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,

                null,
                null,
                null,
                new Date(),
                null
              );
              users.add(newAccount, function (error, result) {
                if (error) {
                  apiResponse.sendInternalError(res, error);
                } else {
                  users.get(result.insertedId, function (error, account) {
                    if (error) {
                      apiResponse.sendInternalError(res, error);
                    } else {
                      authManager.sign(
                        account._id,
                        account.role,
                        res,
                        function (token, expire) {
                          apiResponse.sendSucces(res, {
                            "X-Access-Token": token,
                            "X-Expires-After": expire,
                          });
                        }
                      );
                    }
                  });
                }
              });
            }
          }
        });
      });
    }
  } catch (error) {
    logger.log_error(error);
    return apiResponse.sendInternalError(res, error);
  }
};

exports.logout = function (req, res) {
  try {
    apiResponse.sendSucces(res);
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.getInfo = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      users.get(accountId, function (error, account) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          apiResponse.sendSucces(res, account);
        }
      });
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.editInfo = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      let updateAccount = new accountModel(
        null,
        null,
        req.body.firstName,
        req.body.lastName,
        req.body.fatherName,
        req.body.nationalCode,
        req.body.birthday,
        req.body.gender,
        req.body.email,
        req.body.constPhone,
        req.body.stateName,
        req.body.cityName,
        req.body.homeAddress,
        req.body.bankAccountSheba,
        null,
        null,

        null,
        null,
        accountId,
        null,
        new Date()
      );

      users.update(accountId, updateAccount, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          users.get(accountId, function (error, result) {
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

exports.getRole = function (req, res) {
  try {
    if (!req.query.mobilePhone) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let mobilePhone = String(req.query.mobilePhone);
      users.getByMobilePhone(mobilePhone, function (error, account) {
        if (error) {
          return apiResponse.sendInternalError(res, error);
        }
        if (!account) return apiResponse.sendNotFound(res);
        apiResponse.sendSucces(res, {
          mobilePhone: account.mobilePhone,
          role: account.role,
        });
      });
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.editRole = function (req, res) {
  try {
    if (!req.body.mobilePhone || !req.body.role)
      return apiResponse.sendBadRequest(res);
    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let mobilePhone = String(req.body.mobilePhone);
      users.getByMobilePhone(mobilePhone, function (error, account) {
        if (error) {
          return apiResponse.sendInternalError(res, error);
        }
        if (!account) {
          return apiResponse.sendNotFound(
            res,
            "کاربر با این شماره موبایل هنوز در سیستم ثبت نام نکرده است."
          );
        }
        if (account.role === "superAdmin") {
          return apiResponse.sendNotAccessed(
            res,
            "امکان تغییر سطح کاربری این کاربر نمی باشد."
          );
        }

        let accountEditRole = new accountEditRoleModel(
          req.body.role,

          accountId,
          new Date()
        );

        users.update(account._id, accountEditRole, function (error, result) {
          if (error) {
            apiResponse.sendInternalError(res, error);
          } else {
            users.get(account._id, function (error, result) {
              if (error) {
                return apiResponse.sendInternalError(res, error);
              }
              if (!result) return apiResponse.sendNotFound(res);

              return apiResponse.sendSucces(res, result);
            });
          }
        });
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

function getVerifyUniqCode() {
  return Math.random().toString(10).substr(4, 5).toUpperCase();
}
