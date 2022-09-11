"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;

function carTypeModel(
  code,
  name,
  brandTitle,
  modelTitle,
  useForBody,
  brands,

  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (code) this.code = Number(code);
  if (name || name === "") this.name = String(name);
  if (brandTitle || brandTitle === "") this.brandTitle = String(brandTitle);
  if (modelTitle || modelTitle === "") this.modelTitle = String(modelTitle);
  if (useForBody === false || useForBody === true) this.useForBody = useForBody;
  if (brands) this.brands = brands;

  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function carBrandModel(
  code,
  name,
  latinName,
  icon,
  models,

  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (code) this.code = Number(code);
  if (name || name === "") this.name = String(name);
  if (latinName || latinName === "") this.latinName = String(latinName);
  if (icon || icon === "") this.icon = String(icon);
  if (models) this.models = models;

  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function carModelModel(
  code,
  name,
  latinName,

  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (code) this.code = Number(code);
  if (name || name === "") this.name = String(name);
  if (latinName || latinName === "") this.latinName = String(latinName);

  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function carPriceModel(
  code,
  brandId,
  modelId,
  thirdPartyBasePrice,
  bodyBasePercent,

  createdId,
  updatedId,
  createdDate,
  updatedDate
) {
  if (code) this.code = Number(code);
  if (brandId) this.brandId = new mongodb.ObjectID(brandId);
  if (modelId) this.modelId = new mongodb.ObjectID(modelId);
  if (thirdPartyBasePrice || thirdPartyBasePrice === 0)
    this.thirdPartyBasePrice = Number(thirdPartyBasePrice);
  if (bodyBasePercent || bodyBasePercent === 0)
    this.bodyBasePercent = Number(bodyBasePercent);

  if (createdId) this.createdId = new mongodb.ObjectID(createdId);
  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function editRedSectionModel(
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
  carTypeModel,
  carBrandModel,
  carModelModel,
  carPriceModel,
  editRedSectionModel,
};
