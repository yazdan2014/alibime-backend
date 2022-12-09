'use strict';
const mongodb = require('mongodb');
const dateHelper = require('infrastructure').dateHelper;

function ticketModel(
  trackingCode,
  accountId,
  orderId,
  title,
  text,
  attachmentsURL,
  status
) {
  if (trackingCode) this.trackingCode = Number(trackingCode)
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (orderId) this.orderId = String(orderId);
  if (title) this.title = String(title);
  if (text) this.text = String(text);
  if (attachmentsURL) this.attachmentsURL = String(attachmentsURL);
  if (status) this.status = String(status);
}

module.exports = {
  ticketModel,
};
