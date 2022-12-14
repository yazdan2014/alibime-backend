"use strict";

module.exports = function (app) {
  const ticketcontroller = require("../controllers/ticketController");

  app.route("/v1/ticket").get(ticketcontroller.getsTickets);
  app.route("/v1/ticket").post(ticketcontroller.addNewTicket);
  app.route("/v1/ticket/:_id").get(ticketcontroller.getTicket);
  app.route("/v1/admin/alltickets").get(ticketcontroller.getList);

  app.route("/v1/ticket/:_id").get(ticketcontroller.getTicket);

  app.route("/v1/ticketanswers").get(ticketcontroller.getsTicketAnswers);
  app.route("/v1/ticketanswers").post(ticketcontroller.addNewTicketAnswer);
};
