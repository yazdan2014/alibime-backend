"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const orders = require("database").orders;
// const cars = require("database").cars;
// const orderModel = require("database").orderModel;
const orderNewModel = require("database").carBodyOrderModel;
const updateOrderModel = require("database").carBodyUpdateOrderModel;
const orderEditImageUrlModel = require("database").orderEditImageUrlModel;
const orderEditStatusModel = require("database").orderEditStatusModel;
const orderEditRedSectionModel = require("database").orderEditRedSectionModel;
const logger = require("infrastructure").logger;
const multer = require("multer");
const path = require("path");
const config = require("../../config");
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

exports.addNewOrder = function (req, res) {
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
        req.body.company,
        req.body.status,
        req.body.insType,
        req.body.carTypeName,
        req.body.carBrandName,
        req.body.carModelName,
        req.body.carBuildYear,
        req.body.carValue,
        req.body.orderPrice,
        req.body.insCycleTime,
        req.body.carisIrani,
        req.body.thirdPartyCompany,
        req.body.thirdPartyDiscount,
        req.body.lastCarBodyCompany,
        req.body.carBodyDiscount,
        req.body.coverChemical,
        req.body.coverGlassBreak,
        req.body.coverTransportation,
        req.body.coverPriceFluctuation,
        req.body.coverTheftOfParts,
        req.body.coverNaturalDisasters,
        req.body.maaliat,
        req.body.whithoutMaaliat,
        req.body.coversPrice,

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

exports.updateOrder = function (req, res) {
  try {
    authManager.authentication(req, res, function (accountId) {
      let orderId = req.body._id;
      let updateOrder = new updateOrderModel(
        req.body.status,
        req.body.firstName,
        req.body.lastName,
        req.body.nationalCode,
        req.body.birthday,
        req.body.mobileNumber,
        req.body.insAddress,
        req.body.state,
        req.body.city,
        req.body.sendAddress,

        null,
        new Date()
      );

      orders.update(orderId, accountId, updateOrder, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
          logger.log_error(error);
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
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

function getInsuranceCode() {
  // return Math.floor(Math.random().toString(10).substr(4, 6));
  return Math.random().toString(10).substr(4, 6).toUpperCase();
}
