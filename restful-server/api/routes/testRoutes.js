"use strict";

module.exports = function (app) {
  const testController = require("../controllers/testController");
  const ticketcontroller = require('../controllers/ticketController');

  app.route('/v1/test/ticket').get(ticketcontroller.getsTickets);
  app.route('/v1/test/ticket').post(ticketcontroller.addNewTicket);

  app.route("/v1/test/get").get(testController.get);
};
