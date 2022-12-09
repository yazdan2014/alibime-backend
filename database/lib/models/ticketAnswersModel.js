'use strict';
const mongodb = require('mongodb');
const dateHelper = require('infrastructure').dateHelper;

function ticketAnswersModel(ticketId, accountId, author, text, attachmentsURL) {
  if (ticketId) this.ticketId = new mongodb.ObjectID(ticketId);
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (author) this.author = new mongodb.ObjectID(author);
  if (text) this.text = String(text);
  if (attachmentsURL) this.attachmentsURL = String(attachmentsURL);
}

module.exports = {
  ticketAnswersModel,
};
