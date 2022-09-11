"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;

function reminderModel(
  accountId,
  insuranceType,
  cycle,
  description,
  province,
  city,
  dueDate,
  status,

  deleted,
  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (insuranceType) this.insuranceType = Number(insuranceType);
  if (cycle) this.cycle = Number(cycle);
  if (description || description === "") this.description = String(description);
  if (province) this.province = Number(province);
  if (city) this.city = Number(city);
  if (dueDate) this.dueDate = dateHelper.toValidDateOne(dueDate);
  if (status || status === 0) this.status = Number(status);

  if (deleted === false || deleted === true) this.deleted = deleted;
  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function reminderEditRedSectionModel(
  deleted,
  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (deleted === false || deleted === true) this.deleted = deleted;
  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

module.exports = {
  reminderModel,
  reminderEditRedSectionModel,
};
