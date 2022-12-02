"use strict";

module.exports = function (app) {
  const orderController = require("../controllers/orderController");
  const carBodyController = require("../controllers/carBodyController");

  app.route("/v1/order/getAllByStatus").get(orderController.getAllByStatus);
  app.route("/v1/order/getList").get(orderController.getList);
  // app.route("/v1/order").get(orderController.getsOrders);
  app.route("/v1/order").post(orderController.addNewOrder2);
  app.route("/v1/order/car-body").post(carBodyController.addNewOrder);
  app.route("/v1/order/car-body").put(carBodyController.updateOrder);
  app.route("/v1/order").put(orderController.updateOrder);
  app.route("/v1/order").delete(orderController.deleteOrder);
  app.route("/v1/order/status").put(orderController.updateStatusOrder);
  app.route("/v1/order/:_id").get(orderController.getOrder);
  app.route("/v1/order/:_id").put(orderController.updateOrder);
  app.route("/v1/order/image/:_id/:name").post(orderController.uploadImage);
  // app.route("/v1/order/image/:name").get(orderController.downloadImage);
  app
    .route("/v1/order/downloadImage/:imageName")
    .get(orderController.downloadImage);
};
