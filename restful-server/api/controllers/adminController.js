"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const admin = require("database").admins;
const users = require("database").users;
const orders = require("database").orders;
const trans = require("database").payments;
const smsHelper = require("infrastructure").smsHelper;
const logger = require("infrastructure").logger;
const bcrypt = require("bcrypt");
const path = require("path");
const adminModel = require("database").accountModel;
const adminNewModel = require("database").adminNewModel;

const address = process.env.ALIBIME_IMAGE_PATH + "/orderImages";

exports.sendSms = function (req, res) {
  try {
    if (!req.body.username) {
      apiResponse.sendBadRequest(res);
    } else {
      let username = req.body.username;
      let password = req.body.password;

      admin.getByUserNamePassword(username, password, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(result, error);
        } else {
          if (!result) {
            res.send("username or password incorrect!");
          } else if (result.password === password) {
            let mobilePhone = result.mobilePhone;
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
          } else {
            logger.log_error("error 99");
            apiResponse.sendInternalError(res, error);
          }
        }
      });
    }
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
exports.confirmCode = function (req, res) {
  try {
    if (!req.body.confirmationCode || !req.body.tempToken) {
      apiResponse.sendBadRequest(res);
    } else {
      let username = req.body.username;
      let confirmationCode = String(req.body.confirmationCode);
      let tempToken = String(req.body.tempToken);

      authManager.authenticationTemp(tempToken, res, function (decode) {
        // if confirmationcode not decoded
        // if (String(decode.code) !== confirmationCode)
        if (!bcrypt.compareSync(confirmationCode, decode.code))
          return apiResponse.sendUnAuthorized(res, "کد صحیح نیست!");
        // if (String(decode.mobilePhone) !== mobilePhone)
        //   return apiResponse.sendUnAuthorized(
        //     res,
        //     "اطلاعات وارد شده صحیح نیست."
        //   );

        admin.getByUserName(username, function (error, account) {
          if (error) {
            apiResponse.sendInternalError(res, error);
          } else {
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
          }
        });
      });
    }
  } catch (error) {
    logger.log_error(error);
    return apiResponse.sendInternalError(res, error);
  }
};
exports.getInfo = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      admin.get(accountId, function (error, account) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const data = {
            username: account.username,
            role: account.role,
            mobilePhone: account.mobilePhone,
            fullName: account.firstname + " " + account.lastname,
          };
          apiResponse.sendSucces(res, data);
        }
      });
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
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

exports.addNewAdmin = function (req, res) {
  try {
    if (!req.body.username) return apiResponse.sendBadRequest(res);
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let newAdmin = new adminNewModel(
        req.body.username,
        req.body.password,
        req.body.firstname,
        req.body.lastname,
        req.body.mobilePhone,
        req.body.role
      );
      admin.addNew(newAdmin, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
          logger.log_info("error add new Admin!");
        } else {
          admin.get(result.insertedId, function (error, result) {
            if (error) {
              logger.log_info("error add new Admin!");
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

exports.getAllOrders = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 50;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      admin.getsAllOrders(skip, limit, function (error, result) {
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

exports.getAllAdmins = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 50;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      admin.getsAllAdmins(skip, limit, function (error, result) {
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

exports.getAllUsers = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 50;
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

exports.getOrderById = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params._id) return apiResponse.sendBadRequest(res);
      let orderId = req.params._id;
      orders.get(orderId, function (error, result) {
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

exports.getAllTransactions = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 50;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      admin.getsAllTrans(skip, limit, function (error, result) {
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

exports.getTransByOrderId = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params._id) return apiResponse.sendBadRequest(res);
      let orderId = Number(req.params._id);
      logger.log_info(orderId);
      trans.getByOrderId(orderId, function (error, result) {
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

exports.getOrderByTrackId = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params._id) return apiResponse.sendBadRequest(res);
      let orderId = req.params._id;
      orders.getById(orderId, function (error, result) {
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

exports.deleteOrder = function (req, res) {
  try {
    let roles = ["superAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params._id) return apiResponse.sendBadRequest(res);
      let orderId = req.params._id;
      orders.delete(orderId, function (error, result) {
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

exports.deleteAdmin = function (req, res) {
  try {
    let roles = ["superAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params._username) return apiResponse.sendBadRequest(res);
      let username = req.params._username;
      admin.delete(username, function (error, result) {
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

exports.getTransById = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params._transid) return apiResponse.sendBadRequest(res);
      let transId = Number(req.params._transid);
      logger.log_info(transId);
      trans.getByTransId(transId, function (error, result) {
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

exports.get24NewOrders = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      admin.gets24Orders(function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const data = {
            counter: result.length,
          };
          apiResponse.sendSucces(res, data);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.get24NewTrans = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      admin.gets24Trans(function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const data = {
            counter: result.length,
          };
          apiResponse.sendSucces(res, data);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.get24NewAcc = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      admin.gets24Acc(function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const data = {
            counter: result.length,
          };
          apiResponse.sendSucces(res, data);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.get24NewTickets = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      admin.gets24Tickets(function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const data = {
            counter: result.length,
          };
          apiResponse.sendSucces(res, data);
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.changeStatusById = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.body.orderId && !req.params.status)
        return apiResponse.sendBadRequest(res);
      let status = req.body.status;
      let orderId = req.body.orderId;
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
};

function getVerifyUniqCode() {
  return Math.random().toString(10).substr(4, 5).toUpperCase();
}

exports.downloadImage = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin-lvl1"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.params.imageName || req.params.imageName === "undefined")
        return apiResponse.sendBadRequest(res);

      let imagePath = path.join(address + "/" + req.params.imageName);

      res.download(imagePath);
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};
