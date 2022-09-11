const databaseManager = require("../dataBaseManager").getInstance();
const logger = require("infrastructure").logger;
const mongodb = require("mongodb");

class carRepository {
  constructor() {
    // CarType ------------------------------------
    this.getBiggerThanCodeCarType = function (callback) {
      try {
        databaseManager.database
          .collection("carTypes")
          .find({ deleted: { $ne: true } })
          .limit(1)
          .sort({ code: -1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get bigger than car type code done");
            const code =
              res.length && res.length > 0 && res[0].code && res[0].code > 0
                ? res[0].code
                : 0;
            callback(null, code);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getCarType = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);

        databaseManager.database.collection("carTypes").findOne(
          {
            $and: [{ _id: o_id }, { deleted: { $ne: true } }],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get carType by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getsCarType = function (callback) {
      try {
        databaseManager.database
          .collection("carTypes")
          .find({
            deleted: { $ne: true },
          })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets carTypes done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.addCarType = function (item, callback) {
      try {
        databaseManager.database
          .collection("carTypes")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new carType done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateCarType = function (id, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        delete modifiedFields._id;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("carTypes")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update carTypes done");
                return callback(null, true);
              }
              logger.log_info("no carTypes was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.pushCarType = function (
      id,
      modifiedFields,
      pushNmae,
      pushId,
      callback
    ) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let pushValue = {};
        pushValue[pushNmae] = { _id: new mongodb.ObjectID(pushId) };

        let query = { _id: o_id };
        let newvalues = {
          $set: modifiedFields,
          $addToSet: pushValue,
        };
        databaseManager.database
          .collection("carTypes")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("push carTypes done");
                return callback(null, true);
              }
              logger.log_info("no carTypes was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.pullCarType = function (
      id,
      modifiedFields,
      pullNmae,
      pullId,
      callback
    ) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let pullValue = {};
        pullValue[pullNmae] = { _id: new mongodb.ObjectID(pullId) };

        let query = { _id: o_id };
        let newvalues = {
          $set: modifiedFields,
          $pull: pullValue,
        };
        databaseManager.database
          .collection("carTypes")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("pull carTypes done");
                return callback(null, true);
              }
              logger.log_info("no carTypes was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    // CarBrand ------------------------------------
    this.getBiggerThanCodeCarBrand = function (callback) {
      try {
        databaseManager.database
          .collection("carBrands")
          .find({ deleted: { $ne: true } })
          .limit(1)
          .sort({ code: -1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get bigger than car brand code done");
            const code =
              res.length && res.length > 0 && res[0].code && res[0].code > 0
                ? res[0].code
                : 0;
            callback(null, code);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getCarBrand = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);

        databaseManager.database.collection("carBrands").findOne(
          {
            $and: [{ _id: o_id }, { deleted: { $ne: true } }],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get carBrand by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getsCarBrand = function (callback) {
      try {
        databaseManager.database
          .collection("carBrands")
          .find({
            deleted: { $ne: true },
          })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets carBrands done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.addCarBrand = function (item, callback) {
      try {
        databaseManager.database
          .collection("carBrands")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new carBrand done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateCarBrand = function (id, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        delete modifiedFields._id;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("carBrands")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update carBrands done");
                return callback(null, true);
              }
              logger.log_info("no carBrands was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.pushCarBrand = function (
      id,
      modifiedFields,
      pushNmae,
      pushId,
      callback
    ) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let pushValue = {};
        pushValue[pushNmae] = { _id: new mongodb.ObjectID(pushId) };

        let query = { _id: o_id };
        let newvalues = {
          $set: modifiedFields,
          $addToSet: pushValue,
        };
        databaseManager.database
          .collection("carBrands")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("push carBrands done");
                return callback(null, true);
              }
              logger.log_info("no carBrands was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.pullCarBrand = function (
      id,
      modifiedFields,
      pullNmae,
      pullId,
      callback
    ) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let pullValue = {};
        pullValue[pullNmae] = { _id: new mongodb.ObjectID(pullId) };

        let query = { _id: o_id };
        let newvalues = {
          $set: modifiedFields,
          $pull: pullValue,
        };
        databaseManager.database
          .collection("carBrands")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("pull carBrands done");
                return callback(null, true);
              }
              logger.log_info("no carBrands was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    // CarModel ------------------------------------
    this.getBiggerThanCodeCarModel = function (callback) {
      try {
        databaseManager.database
          .collection("carModels")
          .find({ deleted: { $ne: true } })
          .limit(1)
          .sort({ code: -1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get bigger than car model code done");
            const code =
              res.length && res.length > 0 && res[0].code && res[0].code > 0
                ? res[0].code
                : 0;
            callback(null, code);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getCarModel = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);

        databaseManager.database.collection("carModels").findOne(
          {
            $and: [{ _id: o_id }, { deleted: { $ne: true } }],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get carModel by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getsCarModel = function (callback) {
      try {
        databaseManager.database
          .collection("carModels")
          .find({
            deleted: { $ne: true },
          })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets carModels done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.addCarModel = function (item, callback) {
      try {
        databaseManager.database
          .collection("carModels")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new carModel done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateCarModel = function (id, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        delete modifiedFields._id;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("carModels")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update carModels done");
                return callback(null, true);
              }
              logger.log_info("no carModels was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    // CarPrice ------------------------------------
    this.getBiggerThanCodeCarPrice = function (callback) {
      try {
        databaseManager.database
          .collection("carPrices")
          .find({ deleted: { $ne: true } })
          .limit(1)
          .sort({ code: -1 })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get bigger than car type code done");
            const code =
              res.length && res.length > 0 && res[0].code && res[0].code > 0
                ? res[0].code
                : 0;
            callback(null, code);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getCarPrice = function (id, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);

        databaseManager.database.collection("carPrices").findOne(
          {
            $and: [{ _id: o_id }, { deleted: { $ne: true } }],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get carPrice by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getCarPriceByBrandIdAndModelId = function (
      brandId,
      modelId,
      callback
    ) {
      try {
        let o_brandId = new mongodb.ObjectID(brandId);
        let o_modelId = new mongodb.ObjectID(modelId);

        databaseManager.database.collection("carPrices").findOne(
          {
            $and: [
              { brandId: o_brandId },
              { modelId: o_modelId },
              { deleted: { $ne: true } },
            ],
          },
          function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("get carPrice by id done");
            callback(null, res);
          }
        );
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.getsCarPrice = function (callback) {
      try {
        databaseManager.database
          .collection("carPrices")
          .find({
            deleted: { $ne: true },
          })
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets carPrices done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };

    this.addCarPrice = function (item, callback) {
      try {
        databaseManager.database
          .collection("carPrices")
          .insertOne(item, function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("add new carPrice done");
            callback(null, res);
          });
      } catch (err) {
        logger.log_error(err);
        callback(err, null);
      }
    };

    this.updateCarPrice = function (id, modifiedFields, callback) {
      try {
        let o_id = new mongodb.ObjectID(id);
        let query = { _id: o_id };
        delete modifiedFields._id;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("carPrices")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update carPrices done");
                return callback(null, true);
              }
              logger.log_info("no carPrices was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    this.updateCarPriceByBrandIdAndModelId = function (
      brandId,
      modelId,
      modifiedFields,
      callback
    ) {
      try {
        let o_brandId = new mongodb.ObjectID(brandId);
        let o_modelId = new mongodb.ObjectID(modelId);
        let query = {
          $and: [{ brandId: o_brandId }, { modelId: o_modelId }],
        };
        delete modifiedFields._id;
        delete modifiedFields.accountId;
        let newvalues = {
          $set: modifiedFields,
        };
        databaseManager.database
          .collection("carPrices")
          .updateOne(query, newvalues, function (err, res) {
            try {
              if (err) {
                return callback(err, null);
              }
              if (res.result.nModified && res.result.nModified > 0) {
                logger.log_info("update carPrices done");
                return callback(null, true);
              }
              logger.log_info("no carPrices was updated");
              callback(null, false);
            } catch (error) {
              callback(error, null);
            }
          });
      } catch (err) {
        logger.log_error(err);
        return callback(err, null);
      }
    };

    // CarData ------------------------------------
    this.getsCarData = function (callback) {
      try {
        databaseManager.database
          .collection("carTypes")
          .aggregate([
            { $match: { deleted: { $ne: true } } },
            { $unwind: "$brands" },
            {
              $lookup: {
                from: "carBrands",
                localField: "brands._id",
                foreignField: "_id",
                as: "brands2",
              },
            },
            { $unwind: "$brands2" },
            {
              $lookup: {
                from: "carModels",
                localField: "brands2.models._id",
                foreignField: "_id",
                as: "brands2.models",
              },
            },
            {
              $project: {
                "brands2.createdId": 0,
                "brands2.createdDate": 0,
                "brands2.updatedDate": 0,
                "brands2.updatedId": 0,
                "brands2.models.createdId": 0,
                "brands2.models.createdDate": 0,
                "brands2.models.updatedDate": 0,
                "brands2.models.updatedId": 0,
              },
            },
            {
              $group: {
                _id: "$_id",
                root: { $mergeObjects: "$$ROOT" },
                brands: { $push: "$brands2" },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $mergeObjects: ["$root", "$$ROOT"],
                },
              },
            },
            {
              $project: {
                root: 0,
                createdId: 0,
                createdDate: 0,
                updatedDate: 0,
                updatedId: 0,
                brands2: 0,
              },
            },
          ])
          .toArray(function (err, res) {
            if (err) {
              return callback(err, null);
            }
            logger.log_info("gets car data list done");
            callback(null, res);
          });
      } catch (error) {
        logger.log_error(error);
        callback(error, null);
      }
    };
  }
}

module.exports = carRepository;
