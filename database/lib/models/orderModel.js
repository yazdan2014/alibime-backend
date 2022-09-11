"use strict";
const mongodb = require("mongodb");
const dateHelper = require("infrastructure").dateHelper;

// function orderModel(
//   accountId,
//   code,
//   type,
//   status,
//   price,
//   description,
//   requestDate,
//   startDate,
//   endDate,

//   carTypeId,
//   carBrandId,
//   carModelId,
//   carBuildYear,
//   nationalCode,
//   gender,
//   birthday,
//   province,
//   city,
//   address,
//   carThirdDiscount,
//   carDriverDiscount,
//   carThirdLifeDamage,
//   carThirdFinancialDamage,
//   carDriverLifeDamages,
//   previousCompany,
//   previousStartDate,
//   previousEndDate,
//   carBodyDiscount,
//   carPrice,

//   carCardImageFrontUrl,
//   carCardImageBackUrl,
//   previousInsuranceImageFrontUrl,

//   createdId,
//   updatedId,
//   createdDate,
//   updatedDate
// ) {
//   if (accountId) this.accountId = new mongodb.ObjectID(accountId);
//   if (code) this.code = Number(code);
//   if (type) this.type = Number(type);
//   if (status || status === 0) this.status = Number(status);
//   if (price || price === 0) this.price = Number(price);
//   if (description || description === "") this.description = String(description);
//   if (requestDate) this.requestDate = dateHelper.toValidDateOne(requestDate);
//   if (startDate) this.startDate = dateHelper.toValidDateOne(startDate);
//   if (endDate) this.endDate = dateHelper.toValidDateOne(endDate);

//   if (carTypeId) this.carTypeId = new mongodb.ObjectID(carTypeId);
//   if (carBrandId) this.carBrandId = new mongodb.ObjectID(carBrandId);
//   if (carModelId) this.carModelId = new mongodb.ObjectID(carModelId);
//   if (carBuildYear) this.carBuildYear = Number(carBuildYear);
//   if (nationalCode) this.nationalCode = String(nationalCode);
//   if (gender) this.gender = Number(gender);
//   if (birthday) this.birthday = dateHelper.toValidDateOne(birthday);
//   if (province) this.province = Number(province);
//   if (city) this.city = Number(city);
//   if (address) this.address = String(address);
//   if (carThirdDiscount) this.carThirdDiscount = Number(carThirdDiscount);
//   if (carDriverDiscount) this.carDriverDiscount = Number(carDriverDiscount);
//   if (carThirdLifeDamage) this.carThirdLifeDamage = Number(carThirdLifeDamage);
//   if (carThirdFinancialDamage)
//     this.carThirdFinancialDamage = Number(carThirdFinancialDamage);
//   if (carDriverLifeDamages)
//     this.carDriverLifeDamages = Number(carDriverLifeDamages);
//   if (previousCompany) this.previousCompany = Number(previousCompany);
//   if (previousStartDate)
//     this.previousStartDate = dateHelper.toValidDateOne(previousStartDate);
//   if (previousEndDate)
//     this.previousEndDate = dateHelper.toValidDateOne(previousEndDate);
//   if (carCardImageFrontUrl)
//     this.carCardImageFrontUrl = String(carCardImageFrontUrl);
//   if (carCardImageBackUrl)
//     this.carCardImageBackUrl = String(carCardImageBackUrl);
//   if (previousInsuranceImageFrontUrl)
//     this.previousInsuranceImageFrontUrl = String(
//       previousInsuranceImageFrontUrl
//     );
//   if (carBodyDiscount) this.carBodyDiscount = Number(carBodyDiscount);
//   if (carPrice || carPrice === 0) this.carPrice = Number(carPrice);

//   if (createdId) this.createdId = new mongodb.ObjectID(createdId);
//   if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
//   if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
//   if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
// }

function carBodyOrderModel(
  accountId,
  tracking_code,
  company,
  status,
  insType,
  carTypeName,
  carBrandName,
  carModelName,
  carBuildYear,
  carValue,
  orderPrice,
  insCycleTime,
  carisIrani,
  thirdPartyCompany,
  thirdPartyDiscount,
  lastCarBodyCompany,
  carBodyDiscount,
  coverChemical,
  coverGlassBreak,
  coverTransportation,
  coverPriceFluctuation,
  coverTheftOfParts,
  coverNaturalDisasters,
  maaliat,
  whithoutMaaliat,
  coversPrice,

  createdDate
) {
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (tracking_code) this.tracking_code = Number(tracking_code);
  if (company) this.company = String(company);
  if (status) this.status = Number(status);
  if (insType) this.insType = String(insType);
  if (carTypeName) this.carTypeName = String(carTypeName);
  if (carBrandName) this.carBrandName = String(carBrandName);
  if (carModelName) this.carModelName = String(carModelName);
  if (carBuildYear) this.carBuildYear = String(carBuildYear);
  if (carValue) this.carValue = Number(carValue);
  if (orderPrice) this.orderPrice = Number(orderPrice);
  if (insCycleTime) this.insCycleTime = Number(insCycleTime);
  if (carisIrani) this.carisIrani = String(carisIrani);
  if (thirdPartyCompany) this.thirdPartyCompany = String(thirdPartyCompany);
  if (thirdPartyDiscount) this.thirdPartyDiscount = String(thirdPartyDiscount);
  if (lastCarBodyCompany) this.lastCarBodyCompany = String(lastCarBodyCompany);
  if (carBodyDiscount) this.carBodyDiscount = String(carBodyDiscount);
  if (coverChemical) this.coverChemical = String(coverChemical);
  if (coverGlassBreak) this.coverGlassBreak = String(coverGlassBreak);
  if (coverTransportation)
    this.coverTransportation = String(coverTransportation);
  if (coverPriceFluctuation)
    this.coverPriceFluctuation = String(coverPriceFluctuation);
  if (coverTheftOfParts) this.coverTheftOfParts = String(coverTheftOfParts);
  if (coverNaturalDisasters)
    this.coverNaturalDisasters = String(coverNaturalDisasters);
  if (maaliat) this.maaliat = Number(maaliat);
  if (whithoutMaaliat) this.whithoutMaaliat = Number(whithoutMaaliat);
  if (coversPrice) this.coversPrice = Number(coversPrice);

  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
}

function carBodyUpdateOrderModel(
  status,
  firstName,
  lastName,
  nationalCode,
  birthday,
  mobileNumber,
  insAddress,
  state,
  city,
  sendAddress,

  updatedId,
  updatedDate
) {
  if (status || status === 0) this.status = Number(status);
  if (firstName) this.firstName = String(firstName);
  if (lastName) this.lastName = String(lastName);
  if (nationalCode) this.nationalCode = Number(nationalCode);
  if (birthday) this.birthday = dateHelper.toValidDateOne(birthday);
  if (mobileNumber) this.mobileNumber = String(mobileNumber);
  if (insAddress) this.insAddress = String(insAddress);
  if (state) this.state = String(state);
  if (city) this.city = String(city);
  if (sendAddress) this.sendAddress = String(sendAddress);

  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function orderNewModel(
  accountId,
  tracking_code,
  insStatus,
  company,
  status,
  insType,
  carTypeName,
  carBrandName,
  carModelName,
  carBuildYear,
  orderPrice,
  insCycleTime,
  basePropertyDamage,
  finalBaseProperty,
  maaliat,
  whithoutMaaliat,
  DisThirdparty,
  DisDriver,
  lastPolicyStartDate,
  lastPolicyExpDate,
  havadesFinal,
  jarimeDirkard,
  jarimeDirkardDay,
  financialDamage,
  lifeDamage,
  havadesDamage,

  createdDate
) {
  if (accountId) this.accountId = new mongodb.ObjectID(accountId);
  if (tracking_code) this.tracking_code = Number(tracking_code);
  if (insStatus) this.insStatus = String(insStatus);
  if (company) this.company = String(company);
  if (status) this.status = Number(status);
  if (insType) this.insType = String(insType);
  if (carTypeName) this.carTypeName = String(carTypeName);
  if (carBrandName) this.carBrandName = String(carBrandName);
  if (carModelName) this.carModelName = String(carModelName);
  if (carBuildYear) this.carBuildYear = String(carBuildYear);
  if (orderPrice) this.orderPrice = Number(orderPrice);
  if (insCycleTime) this.insCycleTime = Number(insCycleTime);
  if (basePropertyDamage) this.basePropertyDamage = Number(basePropertyDamage);
  if (finalBaseProperty) this.finalBaseProperty = Number(finalBaseProperty);
  if (maaliat) this.maaliat = Number(maaliat);
  if (whithoutMaaliat) this.whithoutMaaliat = Number(whithoutMaaliat);
  if (DisThirdparty) this.DisThirdparty = Number(DisThirdparty);
  if (DisDriver) this.DisDriver = Number(DisDriver);
  if (lastPolicyStartDate)
    this.lastPolicyStartDate = String(lastPolicyStartDate);
  if (lastPolicyExpDate) this.lastPolicyExpDate = String(lastPolicyExpDate);
  if (havadesFinal) this.havadesFinal = Number(havadesFinal);
  if (jarimeDirkard) this.jarimeDirkard = Number(jarimeDirkard);
  if (jarimeDirkardDay) this.jarimeDirkardDay = Number(jarimeDirkardDay);
  if (financialDamage) this.financialDamage = String(financialDamage);
  if (lifeDamage) this.lifeDamage = String(lifeDamage);
  if (havadesDamage) this.havadesDamage = String(havadesDamage);

  if (createdDate) this.createdDate = dateHelper.toValidDateOne(createdDate);
}

function orderEditImageUrlModel(
  carCardImageFrontUrl,
  carCardImageBackUrl,
  carLastInsImageUrl,
  govahinameImageUrl,

  updatedId,
  updatedDate
) {
  if (carCardImageFrontUrl)
    this.carCardImageFrontUrl = String(carCardImageFrontUrl);
  if (carCardImageBackUrl)
    this.carCardImageBackUrl = String(carCardImageBackUrl);
  if (carLastInsImageUrl)
    this.carLastInsImageUrl = String(carLastInsImageUrl);
  if (govahinameImageUrl) this.govahinameImageUrl = String(govahinameImageUrl);

  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function orderEditStatusModel(
  status,

  updatedId,
  updatedDate
) {
  if (status || status === 0) this.status = Number(status);

  if (updatedId) this.updatedId = new mongodb.ObjectID(updatedId);
  if (updatedDate) this.updatedDate = dateHelper.toValidDateOne(updatedDate);
}

function orderEditRedSectionModel(
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
  // orderModel,
  orderNewModel,
  carBodyOrderModel,
  carBodyUpdateOrderModel,
  orderEditImageUrlModel,
  orderEditStatusModel,
  orderEditRedSectionModel,
};
