"use strict";

module.exports = function (app) {
  const testController = require("../controllers/testController");

  app.route("/v1/test/get").get(testController.get);
};
