"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;
const enumHelper = require("infrastructure").enumHelper;

function adminModel(
  mobilePhone,
  userName,
  password,
  role,
  firstName,
  lastName,
  nationalCode,
  birthday,
  email,

  deleted,
  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (mobilePhone) this.mobilePhone = String(mobilePhone);
  if (userName) this.userName = String(userName);
  if (password) this.password = String(password);
  if (role) this.role = String(role);
  if (firstName || firstName === "") this.firstName = String(firstName);
  if (lastName || lastName === "") this.lastName = String(lastName);
  if (nationalCode || nationalCode === "")
    this.nationalCode = String(nationalCode);
  if (birthday) this.birthday = dateHelper.toValidDateOne(birthday);
  if (email || email === "") this.email = String(email);

  if (deleted === false || deleted === true) this.deleted = deleted;
  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function adminNewModel(
  username,
  password,
  firstname,
  lastname,
  mobilePhone,
  role
) {
  if (username) this.username = String(username);
  if (password) this.password = String(password);
  if (firstname) this.firstname = String(firstname);
  if (lastname) this.lastname = String(lastname);
  if (mobilePhone) this.mobilePhone = String(mobilePhone);
  if (role) this.role = String(role);
}

function adminEditRoleModel(
  role,

  updatedId,
  updatedDate
) {
  if (enumHelper.isValidRole(role)) this.role = role;

  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

module.exports = {
  adminModel,
  adminNewModel,
  adminEditRoleModel,
};
