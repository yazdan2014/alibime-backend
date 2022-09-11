"use strict";

module.exports = function (app) {
  const offerController = require("../controllers/offerController");

  app.route("/v1/offer/thirdparty/").post(offerController.getThirdPartyoffers);
  app.route("/v1/offer/car-body/").post(offerController.getCarBodyoffers);
  app.route("/v1/offer/fire-ins/").post(offerController.getFireInsoffers);
};
