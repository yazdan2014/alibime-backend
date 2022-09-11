"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;

function payNewModel(
  accountId,
  paymentId,
  transactionId,
  orderId,
  amount,
  name,
  phone,
  email,
  desc,
  status,

  createdDate
) {
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (paymentId) this.paymentId = String(paymentId);
  if (transactionId) this.transactionId = Number(transactionId);
  if (orderId) this.orderId = Number(orderId);
  if (amount) this.amount = Number(amount);
  if (name) this.name = String(name);
  if (phone) this.phone = String(phone);
  if (email) this.email = String(email);
  if (desc) this.desc = String(desc);
  if (status) this.status = Number(status);

  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
}

function payUpdateModel(
  status,

  updatedId,
  updatedDate
) {
  if (status || status === 0) this.status = Number(status);

  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

module.exports = {
  payNewModel,
  payUpdateModel,
};
