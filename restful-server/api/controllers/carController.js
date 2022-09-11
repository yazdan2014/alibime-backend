"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const cars = require("database").cars;
const carTypeModel = require("database").carTypeModel;
const carBrandModel = require("database").carBrandModel;
const carModelModel = require("database").carModelModel;
const carPriceModel = require("database").carPriceModel;
const editRedSectionModel = require("database").editRedSectionModel;

const logger = require("infrastructure").logger;

// CarType ------------------------------------
exports.getsCarType = function (req, res) {
  try {
    let skip = 0;
    let limit = 100;
    if (req.query.skip) skip = req.query.skip;
    if (req.query.limit) limit = req.query.limit;

    cars.getsCarType(function (error, result) {
      if (error) {
        apiResponse.sendInternalError(res, error);
      } else {
        apiResponse.sendSucces(res, result);
      }
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.addNewCarType = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      cars.getBiggerThanCodeCarType(function (error, code) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const newCode = +code + 1;

          let newCarType = new carTypeModel(
            newCode,
            req.body.name,
            req.body.brandTitle,
            req.body.modelTitle,
            req.body.useForBody,
            null,

            accountId,
            null,
            new Date(),
            null
          );

          cars.addCarType(newCarType, function (error, result) {
            if (error) {
              apiResponse.sendInternalError(res, error);
            } else {
              cars.getCarType(result.insertedId, function (error, result) {
                if (error) {
                  return apiResponse.sendInternalError(res, error);
                }
                if (!result) return apiResponse.sendNotFound(res);
                return apiResponse.sendSucces(res, result);
              });
            }
          });
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.editCarType = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarType = new carTypeModel(
        null,
        req.body.name,
        req.body.brandTitle,
        req.body.modelTitle,
        req.body.useForBody,
        null,

        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarType(_id, editCarType, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarType(_id, function (error, result) {
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

exports.deleteCarType = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarType = new editRedSectionModel(
        true,
        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarType(_id, editCarType, function (error, result) {
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

exports.pushBrandToCarType = function (req, res) {
  try {
    if (!req.query._id || !req.query.brandId)
      return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;
      let brandId = req.query.brandId;

      let editCarType = new editRedSectionModel(
        null,
        null,
        accountId,
        null,
        new Date()
      );

      cars.pushCarType(_id, editCarType, "brands", brandId, function (
        error,
        result
      ) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarType(_id, function (error, result) {
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

exports.pullBrandFromCarType = function (req, res) {
  try {
    if (!req.query._id || !req.query.brandId)
      return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;
      let brandId = req.query.brandId;

      let editCarType = new editRedSectionModel(
        null,
        null,
        accountId,
        null,
        new Date()
      );

      cars.pullCarType(_id, editCarType, "brands", brandId, function (
        error,
        result
      ) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarType(_id, function (error, result) {
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

// CarBrand ------------------------------------
exports.getsCarBrand = function (req, res) {
  try {
    let skip = 0;
    let limit = 100;
    if (req.query.skip) skip = req.query.skip;
    if (req.query.limit) limit = req.query.limit;

    cars.getsCarBrand(function (error, result) {
      if (error) {
        apiResponse.sendInternalError(res, error);
      } else {
        apiResponse.sendSucces(res, result);
      }
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.addNewCarBrand = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      cars.getBiggerThanCodeCarBrand(function (error, code) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const newCode = +code + 1;

          let newCarBrand = new carBrandModel(
            newCode,
            req.body.name,
            req.body.latinName,
            req.body.icon,
            null,

            accountId,
            null,
            new Date(),
            null
          );

          cars.addCarBrand(newCarBrand, function (error, result) {
            if (error) {
              apiResponse.sendInternalError(res, error);
            } else {
              cars.getCarBrand(result.insertedId, function (error, result) {
                if (error) {
                  return apiResponse.sendInternalError(res, error);
                }
                if (!result) return apiResponse.sendNotFound(res);
                return apiResponse.sendSucces(res, result);
              });
            }
          });
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.editCarBrand = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarBrand = new carBrandModel(
        null,
        req.body.name,
        req.body.latinName,
        req.body.icon,
        null,

        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarBrand(_id, editCarBrand, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarBrand(_id, function (error, result) {
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

exports.deleteCarBrand = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarBrand = new editRedSectionModel(
        true,
        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarBrand(_id, editCarBrand, function (error, result) {
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

exports.pushModelToCarBrand = function (req, res) {
  try {
    if (!req.query._id || !req.query.modelId)
      return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let brandId = req.query._id;
      let modelId = req.query.modelId;

      let editCarBrand = new editRedSectionModel(
        null,
        null,
        accountId,
        null,
        new Date()
      );

      cars.pushCarBrand(brandId, editCarBrand, "models", modelId, function (
        error,
        result
      ) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarBrand(brandId, function (error, brand) {
            if (error) {
              return apiResponse.sendInternalError(res, error);
            }
            if (!brand) return apiResponse.sendNotFound(res);

            // brand.code
            let code = generatePriceCode();
            let newCarPrice = new carPriceModel(
              code,
              brandId,
              modelId,
              null,

              accountId,
              null,
              new Date(),
              null
            );
            cars.addCarPrice(newCarPrice, function (error, result) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                return apiResponse.sendSucces(res, brand);
              }
            });
          });
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.pullModelFromCarBrand = function (req, res) {
  try {
    if (!req.query._id || !req.query.modelId)
      return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let brandId = req.query._id;
      let modelId = req.query.modelId;

      let editCarBrand = new editRedSectionModel(
        null,
        null,
        accountId,
        null,
        new Date()
      );

      cars.pullCarBrand(brandId, editCarBrand, "models", modelId, function (
        error,
        result
      ) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          let editCarPrice = new editRedSectionModel(
            true,
            null,
            accountId,
            null,
            new Date()
          );

          cars.updateCarPriceByBrandIdAndModelId(
            brandId,
            modelId,
            editCarPrice,
            function (error, result) {
              if (error) {
                apiResponse.sendInternalError(res, error);
              } else {
                cars.getCarBrand(brandId, function (error, result) {
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
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

// CarModel ------------------------------------
exports.getsCarModel = function (req, res) {
  try {
    let skip = 0;
    let limit = 100;
    if (req.query.skip) skip = req.query.skip;
    if (req.query.limit) limit = req.query.limit;

    cars.getsCarModel(function (error, result) {
      if (error) {
        apiResponse.sendInternalError(res, error);
      } else {
        apiResponse.sendSucces(res, result);
      }
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.addNewCarModel = function (req, res) {
  try {
    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      cars.getBiggerThanCodeCarModel(function (error, code) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          const newCode = +code + 1;

          let newCarModel = new carModelModel(
            newCode,
            req.body.name,
            req.body.latinName,

            accountId,
            null,
            new Date(),
            null
          );

          cars.addCarModel(newCarModel, function (error, result) {
            if (error) {
              apiResponse.sendInternalError(res, error);
            } else {
              cars.getCarModel(result.insertedId, function (error, result) {
                if (error) {
                  return apiResponse.sendInternalError(res, error);
                }
                if (!result) return apiResponse.sendNotFound(res);
                return apiResponse.sendSucces(res, result);
              });
            }
          });
        }
      });
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.editCarModel = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarModel = new carModelModel(
        null,
        req.body.name,
        req.body.latinName,

        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarModel(_id, editCarModel, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarModel(_id, function (error, result) {
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

exports.deleteCarModel = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarModel = new editRedSectionModel(
        true,
        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarModel(_id, editCarModel, function (error, result) {
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

// CarPrice ------------------------------------
exports.getsCarPrice = function (req, res) {
  try {
    let skip = 0;
    let limit = 100;
    if (req.query.skip) skip = req.query.skip;
    if (req.query.limit) limit = req.query.limit;

    cars.getsCarPrice(function (error, result) {
      if (error) {
        apiResponse.sendInternalError(res, error);
      } else {
        apiResponse.sendSucces(res, result);
      }
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

exports.editCarPrice = function (req, res) {
  try {
    if (!req.query._id) return apiResponse.sendBadRequest(res);

    let roles = ["superAdmin", "powerAdmin"];
    authManager.authenticationWithRole(req, res, roles, function (accountId) {
      let _id = req.query._id;

      let editCarPrice = new carPriceModel(
        null,
        null,
        null,
        req.body.thirdPartyBasePrice,
        req.body.bodyBasePercent,

        null,
        accountId,
        null,
        new Date()
      );

      cars.updateCarPrice(_id, editCarPrice, function (error, result) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          cars.getCarPrice(_id, function (error, result) {
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

// CarData ------------------------------------
exports.getsCarData = function (req, res) {
  try {
    cars.getsCarData(function (error, result) {
      if (error) {
        apiResponse.sendInternalError(res, error);
      } else {
        apiResponse.sendSucces(res, result);
      }
    });
  } catch (error) {
    apiResponse.sendInternalError(res, error);
    logger.log_error(error);
  }
};

function generatePriceCode() {
  return Number(Math.random().toString(10).substr(4, 6));
}
