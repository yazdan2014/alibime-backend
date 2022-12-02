'use strict';

module.exports = function (app) {
  const ticketcontroller = require('../controllers/ticketController');

  app.route('/v1/ticket').get(ticketcontroller.getsTickets);
  app.route('/v1/ticket').post(ticketcontroller.addNewTicket);

};
