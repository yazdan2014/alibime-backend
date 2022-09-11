"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const orders = require("database").orders;
const account = require("database").users;
const cars = require("database").cars;
const orderModel = require("database").orderModel;
const orderNewModel = require("database").orderNewModel;
const orderEditImageUrlModel = require("database").orderEditImageUrlModel;
const orderEditStatusModel = require("database").orderEditStatusModel;
const orderEditRedSectionModel = require("database").orderEditRedSectionModel;
const logger = require("infrastructure").logger;
const multer = require("multer");
const path = require("path");
const config = require("../../config");
const smsHelper = require("infrastructure").smsHelper;
const { dateHelper } = require("infrastructure");
const { enumHelper } = require("infrastructure");

const address = process.env.ALIBIME_IMAGE_PATH + "/orderImages";
let name = "";

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let imagePath = path.join(address);
    callback(null, imagePath);
  },
  filename: function (req, file, callback) {
    callback(null, name);
  },
});

let uploadMulter = multer({
  storage: storage,
  limits: { fileSize: config.upload_file_max_size },
}).single("image");

exports.getAllByStatus = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      if (!req.query.statusStart || !req.query.statusEnd)
        return apiResponse.sendBadRequest(res);

      let skip = 0;
      let limit = 20;
      let statusStart = Number(req.query.statusStart);
      let statusEnd = Number(req.query.statusEnd);
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      orders.getAllByStatusRange(
        statusStart,
        statusEnd,
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

exports.getList = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let skip = 0;
      let limit = 2000;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      orders.getList(skip, limit, function (error, result) {
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

exports.getsOrders = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      let skip = 0;
      let limit = 20;
      if (req.query.skip) skip = req.query.skip;
      if (req.query.limit) limit = req.query.limit;

      orders.gets(accountId, skip, limit, function (error, result) {
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

exports.getOrder = function (req, res) {
  try {
    if (!req.params._id) return apiResponse.sendBadRequest(res);
    authManager.authentication(req, res, function (accountId) {
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

exports.addNewOrder2 = function (req, res) {
  try {
    if (!req.body.insType)
      return (
        apiResponse.sendBadRequest(res), logger.log_info("bad req new Order!")
      );

    authManager.authentication(req, res, function (accountId) {
      let trackingCode = getInsuranceCode();
      let newOrder2 = new orderNewModel(
        accountId,
        trackingCode,
        req.body.insStatus,
        req.body.company,
        req.body.status,
        req.body.insType,
        req.body.carTypeName,
        req.body.carBrandName,
        req.body.carModelName,
        req.body.carBuildYear,
        req.body.orderPrice,
        req.body.insCycleTime,
        req.body.basePropertyDamage,
        req.body.finalBaseProperty,
        req.body.maaliat,
        req.body.whithoutMaaliat,
        req.body.DisThirdparty,
        req.body.DisDriver,
        req.body.lastPolicyStartDate,
        req.body.lastPolicyExpDate,
        req.body.havadesFinal,
        req.body.jarimeDirkard,
        req.body.jarimeDirkardDay,
        req.body.financialDamage,
        req.body.lifeDamage,
        req.body.havadesDamage,

        new Date()
      );
      orders.add(newOrder2, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
          logger.log_info("error add new Order!");
        } else {
          orders.get(result.insertedId, function (error, result) {
            if (error) {
              logger.log_info("error add new Order!");
              return apiResponse.sendInternalError(res, error);
            }
            if (!result) return apiResponse.sendNotFound(res);
            logger.log_info("add new Order Done!");

            // account.get(result.accountId, function (error, result) {
            //   if (error) {
            //     logger.log_info("error add new Order!");
            //     return apiResponse.sendInternalError(res, error);
            //   }
            //   if (!result) return apiResponse.sendNotFound(res);

            //   let message = "سفارش شما با موفقیت ثبت شد!";
            //   let mobile = "09126818995";
            //   smsHelper.sendSMS(mobile, message, function (error, result) {
            //     if (error) {
            //       logger.log_info("sms send error!");
            //       return apiResponse.sendInternalError(res, error);
            //     }
            //     if (!result) return apiResponse.sendNotFound(res);
            //     logger.log_info("send sms done!");
            //   });

            //   return apiResponse.sendSucces(res, result);
            // });
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

exports.addNewOrder = function (req, res) {
  try {
    if (!req.body.type) return apiResponse.sendBadRequest(res);

    authManager.authentication(req, res, function (accountId) {
      let code = getInsuranceCode();
      let type = req.body.type;
      let carBrandId = req.body.carBrandId;
      let carModelId = req.body.carModelId;
      let previousEndDate = req.body.previousEndDate;
      let requestDate = new Date();
      let carBuildYear = req.body.carBuildYear;
      let carThirdDiscount = req.body.carThirdDiscount;
      let carThirdLifeDamage = req.body.carThirdLifeDamage;
      let carThirdFinancialDamage = req.body.carThirdFinancialDamage;
      let carBodyDiscount = req.body.carBodyDiscount;
      let carPrice = req.body.carPrice;

      priceCalculate(
        type,
        carBrandId,
        carModelId,
        previousEndDate,
        requestDate,
        carBuildYear,
        carThirdDiscount,
        carThirdLifeDamage,
        carThirdFinancialDamage,
        carBodyDiscount,
        carPrice,
        function (error, price) {
          if (error) {
            apiResponse.sendInternalError(res, error);
          } else {
            let newOrder = new orderModel(
              accountId,
              code,
              req.body.type,
              req.body.status,
              price,
              req.body.description,
              requestDate,
              req.body.startDate,
              req.body.endDate,
              req.body.carTypeId,
              req.body.carBrandId,
              req.body.carModelId,
              req.body.carBuildYear,
              req.body.nationalCode,
              req.body.gender,
              req.body.birthday,
              req.body.province,
              req.body.city,
              req.body.address,
              req.body.carThirdDiscount,
              req.body.carDriverDiscount,
              req.body.carThirdLifeDamage,
              req.body.carThirdFinancialDamage,
              req.body.carDriverLifeDamages,
              req.body.previousCompany,
              req.body.previousStartDate,
              req.body.previousEndDate,
              req.body.carBodyDiscount,
              req.body.carPrice,
              req.body.carCardImageFrontUrl,
              req.body.carCardImageBackUrl,
              req.body.carLastInsImageUrl,
              req.body.govahinameImageUrl,

              accountId,
              null,
              new Date(),
              null
            );

            orders.add(newOrder, function (error, result) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                orders.get(result.insertedId, function (error, result) {
                  if (error) {
                    return apiResponse.sendInternalError(res, error);
                  }
                  if (!result) return apiResponse.sendNotFound(res);
                  return apiResponse.sendSucces(res, result);
                });
              }
            });
          }
        }
      );
    });
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

exports.updateOrder = function (req, res) {
  try {
    if (!req.body._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin", "admin", "blog", "user"];
    authManager.authenticationWithRole(
      req,
      res,
      roles,
      function (accountId, role) {
        let orderId = req.body._id;

        orders.get(orderId, function (error, result) {
          if (error) {
            return apiResponse.sendInternalError(res, error);
          }
          if (!result) return apiResponse.sendNotFound(res);

          let type = result.type;
          let carBrandId = req.body.carBrandId;
          let carModelId = req.body.carModelId;
          let previousEndDate = req.body.previousEndDate;
          let requestDate = new Date();
          let carBuildYear = req.body.carBuildYear;
          let carThirdDiscount = req.body.carThirdDiscount;
          let carThirdLifeDamage = req.body.carThirdLifeDamage;
          let carThirdFinancialDamage = req.body.carThirdFinancialDamage;
          let carBodyDiscount = req.body.carBodyDiscount;
          let carPrice = req.body.carPrice;

          priceCalculate(
            type,
            carBrandId,
            carModelId,
            previousEndDate,
            requestDate,
            carBuildYear,
            carThirdDiscount,
            carThirdLifeDamage,
            carThirdFinancialDamage,
            carBodyDiscount,
            carPrice,
            function (error, price) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                let updateOrder = new orderModel(
                  null,
                  null,
                  null,
                  null,
                  price,
                  req.body.description,
                  requestDate,
                  req.body.startDate,
                  req.body.endDate,
                  req.body.carTypeId,
                  req.body.carBrandId,
                  req.body.carModelId,
                  req.body.carBuildYear,
                  req.body.nationalCode,
                  req.body.gender,
                  req.body.birthday,
                  req.body.province,
                  req.body.city,
                  req.body.address,
                  req.body.carThirdDiscount,
                  req.body.carDriverDiscount,
                  req.body.carThirdLifeDamage,
                  req.body.carThirdFinancialDamage,
                  req.body.carDriverLifeDamages,
                  req.body.previousCompany,
                  req.body.previousStartDate,
                  req.body.previousEndDate,
                  req.body.carBodyDiscount,
                  req.body.carPrice,
                  req.body.carCardImageFrontUrl,
                  req.body.carCardImageBackUrl,
                  req.body.carLastInsImageUrl,
                  req.body.govahinameImageUrl,

                  null,
                  accountId,
                  null,
                  new Date()
                );

                if (role === "user" || role === "blog") {
                  orders.update(
                    orderId,
                    accountId,
                    updateOrder,
                    function (error, result) {
                      if (error) {
                        apiResponse.sendInternalError(res, error);
                      } else {
                        orders.get(orderId, function (error, result) {
                          if (error) {
                            return apiResponse.sendInternalError(res, error);
                          }
                          if (!result) return apiResponse.sendNotFound(res);

                          return apiResponse.sendSucces(res, result);
                        });
                      }
                    }
                  );
                } else {
                  orders.updateById(
                    orderId,
                    updateOrder,
                    function (error, result) {
                      if (error) {
                        apiResponse.sendInternalError(res, error);
                      } else {
                        orders.get(orderId, function (error, result) {
                          if (error) {
                            return apiResponse.sendInternalError(res, error);
                          }
                          if (!result) return apiResponse.sendNotFound(res);

                          return apiResponse.sendSucces(res, result);
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        });
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.updateOrder2 = function (req, res) {
  try {
    if (!req.body._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin", "admin", "blog", "user"];
    authManager.authenticationWithRole(
      req,
      res,
      roles,
      function (accountId, role) {
        let orderId = req.body._id;

        orders.get(orderId, function (error, result) {
          if (error) {
            return apiResponse.sendInternalError(res, error);
          }
          if (!result) return apiResponse.sendNotFound(res);

          let type = result.type;
          let carBrandId = req.body.carBrandId;
          let carModelId = req.body.carModelId;
          let previousEndDate = req.body.previousEndDate;
          let requestDate = new Date();
          let carBuildYear = req.body.carBuildYear;
          let carThirdDiscount = req.body.carThirdDiscount;
          let carThirdLifeDamage = req.body.carThirdLifeDamage;
          let carThirdFinancialDamage = req.body.carThirdFinancialDamage;
          let carBodyDiscount = req.body.carBodyDiscount;
          let carPrice = req.body.carPrice;

          priceCalculate(
            type,
            carBrandId,
            carModelId,
            previousEndDate,
            requestDate,
            carBuildYear,
            carThirdDiscount,
            carThirdLifeDamage,
            carThirdFinancialDamage,
            carBodyDiscount,
            carPrice,
            function (error, price) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                let updateOrder = new orderModel(
                  null,
                  null,
                  null,
                  null,
                  price,
                  req.body.description,
                  requestDate,
                  req.body.startDate,
                  req.body.endDate,
                  req.body.carTypeId,
                  req.body.carBrandId,
                  req.body.carModelId,
                  req.body.carBuildYear,
                  req.body.nationalCode,
                  req.body.gender,
                  req.body.birthday,
                  req.body.province,
                  req.body.city,
                  req.body.address,
                  req.body.carThirdDiscount,
                  req.body.carDriverDiscount,
                  req.body.carThirdLifeDamage,
                  req.body.carThirdFinancialDamage,
                  req.body.carDriverLifeDamages,
                  req.body.previousCompany,
                  req.body.previousStartDate,
                  req.body.previousEndDate,
                  req.body.carBodyDiscount,
                  req.body.carPrice,
                  req.body.carCardImageFrontUrl,
                  req.body.carCardImageBackUrl,
                  req.body.carLastInsImageUrl,
                  req.body.govahinameImageUrl,

                  null,
                  accountId,
                  null,
                  new Date()
                );

                if (role === "user" || role === "blog") {
                  orders.update(
                    orderId,
                    accountId,
                    updateOrder,
                    function (error, result) {
                      if (error) {
                        apiResponse.sendInternalError(res, error);
                      } else {
                        orders.get(orderId, function (error, result) {
                          if (error) {
                            return apiResponse.sendInternalError(res, error);
                          }
                          if (!result) return apiResponse.sendNotFound(res);

                          return apiResponse.sendSucces(res, result);
                        });
                      }
                    }
                  );
                } else {
                  orders.updateById(
                    orderId,
                    updateOrder,
                    function (error, result) {
                      if (error) {
                        apiResponse.sendInternalError(res, error);
                      } else {
                        orders.get(orderId, function (error, result) {
                          if (error) {
                            return apiResponse.sendInternalError(res, error);
                          }
                          if (!result) return apiResponse.sendNotFound(res);

                          return apiResponse.sendSucces(res, result);
                        });
                      }
                    }
                  );
                }
              }
            }
          );
        });
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.deleteOrder = function (req, res) {
  try {
    if (!req.body._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin", "admin", "blog", "user"];
    authManager.authenticationWithRole(
      req,
      res,
      roles,
      function (accountId, role) {
        let orderId = req.body._id;
        let orderEditRedSection = new orderEditRedSectionModel(
          true,
          null,
          accountId,
          null,
          new Date()
        );

        if (role === "user" || role === "blog") {
          orders.update(
            orderId,
            accountId,
            orderEditRedSection,
            function (error, result) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                return apiResponse.sendSucces(res);
              }
            }
          );
        } else {
          orders.updateById(
            orderId,
            orderEditRedSection,
            function (error, result) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                return apiResponse.sendSucces(res);
              }
            }
          );
        }
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.updateStatusOrder = function (req, res) {
  try {
    if (!req.body._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin", "admin", "blog", "user"];
    authManager.authenticationWithRole(
      req,
      res,
      roles,
      function (accountId, role) {
        let orderId = req.body._id;
        let orderEditStatus = new orderEditStatusModel(
          req.body.status,

          accountId,
          new Date()
        );

        if (role === "user" || role === "blog") {
          orders.update(
            orderId,
            accountId,
            orderEditStatus,
            function (error, result) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                orders.get(orderId, function (error, result) {
                  if (error) {
                    return apiResponse.sendInternalError(res, error);
                  }
                  if (!result) return apiResponse.sendNotFound(res);

                  return apiResponse.sendSucces(res, result);
                });
              }
            }
          );
        } else {
          orders.updateById(orderId, orderEditStatus, function (error, result) {
            if (error) {
              apiResponse.sendInternalError(res, error);
            } else {
              orders.get(orderId, function (error, result) {
                if (error) {
                  return apiResponse.sendInternalError(res, error);
                }
                if (!result) return apiResponse.sendNotFound(res);

                return apiResponse.sendSucces(res, result);
              });
            }
          });
        }
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.uploadImage = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin", "admin", "blog", "user"];
    authManager.authenticationWithRole(
      req,
      res,
      roles,
      function (accountId, role) {
        let orderId = req.params._id;
        let filedName = req.params.name;

        name = getFileName(accountId) + ".jpg";
        uploadMulter(req, res, function (err) {
          if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
              const message =
                " حداکثر سایز مجاز فایل " +
                String(config.upload_file_max_size / 1024) +
                " کیلو بایت می باشد ";
              apiResponse.sendBadRequest(res, message);
            } else apiResponse.sendInternalError(res, err);
          } else if (err) {
            apiResponse.sendInternalError(res, err);
          } else {
            let orderEditImageUrl = new orderEditImageUrlModel(
              filedName === "carCardImageFrontUrl" ? name : null,
              filedName === "carCardImageBackUrl" ? name : null,
              filedName === "carLastInsImageUrl" ? name : null,
              filedName === "govahinameImageUrl" ? name : null,

              accountId,
              new Date()
            );

            if (role === "user" || role === "blog") {
              orders.update(
                orderId,
                accountId,
                orderEditImageUrl,
                function (error, result) {
                  if (error) {
                    apiResponse.sendInternalError(res, error);
                  } else {
                    orders.get(orderId, function (error, result) {
                      if (error) {
                        return apiResponse.sendInternalError(res, error);
                      }
                      if (!result) return apiResponse.sendNotFound(res);

                      return apiResponse.sendSucces(res, result);
                    });
                  }
                }
              );
            } else {
              orders.updateById(
                orderId,
                orderEditImageUrl,
                function (error, result) {
                  if (error) {
                    apiResponse.sendInternalError(res, error);
                  } else {
                    orders.get(orderId, function (error, result) {
                      if (error) {
                        return apiResponse.sendInternalError(res, error);
                      }
                      if (!result) return apiResponse.sendNotFound(res);

                      return apiResponse.sendSucces(res, result);
                    });
                  }
                }
              );
            }
          }
        });
      }
    );
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.downloadImage = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
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

function getFileName(id) {
  return (
    Math.ceil(Date.now() / 1000) +
    "-" +
    String(id) +
    "-" +
    Math.random().toString(10).substr(4, 9)
  );
}

function getInsuranceCode() {
  // return Math.floor(Math.random().toString(10).substr(4, 6));
  return Math.random().toString(10).substr(5, 6).toUpperCase();
}

function getUniqueCodeOrdered() {
  var result = "";
  var characters = "0123456789";
  var charactersLength = 6;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function priceCalculate(
  type,
  brandId,
  modelId,
  previousEndDate,
  requestDate,
  carBuildYear,
  carThirdDiscount,
  carThirdLifeDamage,
  carThirdFinancialDamage,
  carBodyDiscount,
  carPrice,

  callback
) {
  cars.getCarPriceByBrandIdAndModelId(
    brandId,
    modelId,
    function (error, result) {
      if (error) {
        callback(error);
      } else {
        // thirdParty
        if (type === 1) {
          let thirdPartyBasePrice = result.thirdPartyBasePrice;
          let price = thirdPartyBasePrice;
          let dirkardBase = +thirdPartyBasePrice / 365; // جریمه دیرکرد به ازای یک روز
          let dirkardDayCount = dateHelper.getDiiferenceInDay(
            requestDate,
            previousEndDate
          );
          let oldCarBuild =
            dateHelper.getDiiferenceInYear(new Date(), new Date("21/3/1987")) -
            +carBuildYear; // محاسبه مقدار تفاوت سال ساخت با الان
          let thirdDiscount =
            enumHelper.getCarThirdDiscontCount(carThirdDiscount); // درصد تخفیف شخص ثالث
          let lifeDamage =
            enumHelper.getCarThirdLifeDamageCount(carThirdLifeDamage); // درصد خسارت مالی
          let financialDamage = enumHelper.getCarThirdFinancialDamageCount(
            carThirdFinancialDamage
          ); // درصد خسارت جانی

          // جریمه دیرکرد
          if (dirkardDayCount > 0)
            price = +price + +dirkardBase * +dirkardDayCount;
          // خودروهای بالای 15 سال ساخت به ازای هر سال 2درصد افزایش قیمت دارند
          if (oldCarBuild > 15) {
            let a = (+oldCarBuild - 15) * 2; // محاسبه عدد درصد
            let value = (+price * +a) / 100; // محاسبه مقدار عددی افزایش
            price = +price + value;
          }
          let priceSave = price;
          // محاسبه تخفیف عدم خسارت
          if (thirdDiscount > 0) {
            let value = (+priceSave * +thirdDiscount) / 100; // محاسبه مقدار عددی کاهش
            price = +price - value;
          }
          // محاسبه خسارت مالی و جانی
          if (+lifeDamage + +financialDamage > 0) {
            let total = +lifeDamage + +financialDamage;
            let value = (+priceSave * +total) / 100; // محاسبه مقدار عددی افزایش
            price = +price + value;
          }

          callback(null, Math.ceil(price));
        }
        // carBody
        else if (type === 2) {
          let bodyBasePercent = Number(result.bodyBasePercent);
          if (!(bodyBasePercent < 100 && bodyBasePercent > 0))
            return callback("body base percent error");

          let bodyDiscount = enumHelper.getCarBodyDiscontCount(carBodyDiscount); // درصد تخفیف بدنه

          let price = (+carPrice * +bodyBasePercent) / 100; // قیمت پایه بیمه بدنه

          // محاسبه تخفیف بیمه بدنه
          if (bodyDiscount > 0) {
            let value = (+price * +bodyDiscount) / 100; // محاسبه مقدار عددی کاهش
            price = +price - value;
          }

          callback(null, Math.ceil(price));
        } else {
          callback(null, Math.ceil(1000));
        }
      }
    }
  );
}
