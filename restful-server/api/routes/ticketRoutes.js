'use strict';

module.exports = function (app) {
  const ticketcontroller = require('../controllers/ticketController');

  app.route('/v1/ticket').get(ticketcontroller.getsTickets);
  app.route('/v1/ticket').post(ticketcontroller.addNewTicket);
  app.route('/v1/tickettest').get((req, res) => {
    res.send('Get a random book');
  });
};
