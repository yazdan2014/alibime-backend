"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;
const enumHelper = require("infrastructure").enumHelper;

function accountModel(
  mobilePhone,
  role,
  firstName,
  lastName,
  fatherName,
  nationalCode,
  birthday,
  gender,
  email,
  constPhone,
  stateName,
  cityName,
  homeAddress,
  bankAccountSheba,
  amount,
  score,

  deleted,
  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (mobilePhone) this.mobilePhone = String(mobilePhone);
  if (role) this.role = String(role);
  if (firstName || firstName === "") this.firstName = String(firstName);
  if (lastName || lastName === "") this.lastName = String(lastName);
  if (fatherName || fatherName === "") this.fatherName = String(fatherName);
  if (nationalCode || nationalCode === "")
    this.nationalCode = String(nationalCode);
  if (birthday) this.birthday = dateHelper.toValidDateOne(birthday);
  if (gender || gender === 0) this.gender = String(gender);
  if (email || email === "") this.email = String(email);
  if (constPhone || constPhone === "") this.constPhone = String(constPhone);
  if (stateName || stateName === "") this.stateName = String(stateName);
  if (cityName || cityName === "") this.cityName = String(cityName);
  if (homeAddress || homeAddress === "") this.homeAddress = String(homeAddress);
  if (bankAccountSheba || bankAccountSheba === "")
    this.bankAccountSheba = String(bankAccountSheba);
  if (amount || amount === 0) this.amount = Number(amount);
  if (score || score === 0) this.score = Number(score);

  if (deleted === false || deleted === true) this.deleted = deleted;
  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function accountEditRoleModel(
  role,

  updatedId,
  updatedDate
) {
  if (enumHelper.isValidRole(role)) this.role = role;

  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

module.exports = {
  accountModel,
  accountEditRoleModel,
};
