'use strict';
const mongodb = require('mongodb');
const dateHelper = require('infrastructure').dateHelper;

function ticketModel(
  accountId,
  orderId,
  title,
  text,
  attachmentsURL,
  status
) {
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (orderId) this.orderId = Number(orderId);
  if (title) this.title = String(title);
  if (text) this.text = Number(orderId);
  if (attachmentsURL) this.attachmentsURL = String(text);
  if (status) this.status = String(status);
}

function ticketAnswersModel(
  ticketId,
  accountId,
  orderId,
  authorId,
  text,
  attachmentsURL
) {
  if (ticketId) this.ticketId = new mongodb.ObjectID(ticketId);
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (orderId) this.orderId = Number(orderId);
  if (authorId) this.author = new mongodb.ObjectID(authorId);
  if (text) this.text = Number(orderId);
  if (attachmentsURL) this.attachmentsURL = String(text);
}

module.exports = {
  ticketModel,
  ticketAnswersModel
};
