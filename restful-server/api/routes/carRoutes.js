"use strict";

module.exports = function (app) {
  const carController = require("../controllers/carController");

  app.route("/v1/car/carType").get(carController.getsCarType);
  app.route("/v1/car/carType").post(carController.addNewCarType);
  app.route("/v1/car/carType").put(carController.editCarType);
  app.route("/v1/car/carType").delete(carController.deleteCarType);
  app.route("/v1/car/carType/brand").put(carController.pushBrandToCarType);
  app.route("/v1/car/carType/brand").delete(carController.pullBrandFromCarType);
  app.route("/v1/car/carBrand").get(carController.getsCarBrand);
  app.route("/v1/car/carBrand").post(carController.addNewCarBrand);
  app.route("/v1/car/carBrand").put(carController.editCarBrand);
  app.route("/v1/car/carBrand").delete(carController.deleteCarBrand);
  app.route("/v1/car/carBrand/model").put(carController.pushModelToCarBrand);
  app
    .route("/v1/car/carBrand/model")
    .delete(carController.pullModelFromCarBrand);
  app.route("/v1/car/carModel").get(carController.getsCarModel);
  app.route("/v1/car/carModel").post(carController.addNewCarModel);
  app.route("/v1/car/carModel").put(carController.editCarModel);
  app.route("/v1/car/carModel").delete(carController.deleteCarModel);
  app.route("/v1/car/carPrice").get(carController.getsCarPrice);
  app.route("/v1/car/carPrice").put(carController.editCarPrice);
  app.route("/v1/car/data").get(carController.getsCarData);
};
