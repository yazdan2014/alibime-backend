"use strict";

const apiResponse = require("../apiResponse");
const authManager = require("../authManager");
const logger = require("infrastructure").logger;
// const { dateHelper } = require("infrastructure");
const { enumHelper } = require("infrastructure");

exports.getThirdPartyoffers = function (req, res) {
  try {
    if (!req.body.carType) return apiResponse.sendBadRequest(res);
    logger.log_info("dis: " + req.body.havadesDiscount);
    let carType = req.body.carType;
    let carBrand = req.body.carBrand;
    let carModel = req.body.carModel;
    let carCylinder = req.body.carCylinder;
    let jarimeDays = req.body.jarimeDays;
    let policyStatus = req.body.policyStatus;
    let carBuildYear = req.body.carBuildYear;
    let lastPolicyStartDate = req.body.lastPolicyStartDate;
    let lastPolicyExpDate = req.body.lastPolicyExpDate;
    let propertyDamage = req.body.basePropertyDamage;
    let carThirdDiscount = req.body.carThirdDiscount;
    let havadesDiscount = req.body.havadesDiscount;
    let maaliDamage = req.body.financialDamage;
    let jaaniDamage = req.body.lifeDamage;
    let havadesDamage = req.body.havadesDamage;
    thirdpartyCalculate(
      carType,
      carBrand,
      carModel,
      carCylinder,
      jarimeDays,
      carBuildYear,
      policyStatus,
      lastPolicyStartDate,
      lastPolicyExpDate,
      propertyDamage,
      carThirdDiscount,
      havadesDiscount,
      maaliDamage,
      jaaniDamage,
      havadesDamage,
      function (error, price) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          return apiResponse.sendSucces(res, price);
        }
      }
    );
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

function thirdpartyPriceCalculate(
  carType,
  carBrand,
  carModel,
  carCylinder,
  jarimeDays,
  carBuildYear,
  policyStatus,
  lastPolicyStartDate,
  lastPolicyExpDate,
  propertyDamage,
  carThirdDiscount,
  havadesDiscount,
  maaliDamage,
  jaaniDamage,
  havadesDamage,

  callback
) {
  let Base_price = 0; //Mokhtalef
  let Havades_ranande = 0;
  let z40 = 1.66
  let z120 = 2.5
  let oldCarBuild = new Date().getFullYear() - carBuildYear; // محاسبه مقدار تفاوت سال ساخت با الان
  // Set Base Price From Car Data's
  // مرحله اول تعیین قیمت پایه و میزان جریمه دیرکرد براساس تایپ خودرو


  let ThirdDiscountCalculated = 0;
  let havadesDiscountCalculated = 0;
  let thirdDiscountCal = 0;
  let maaliDamageCal = 0;

  // محاسبه جریمه دیرکرد
  let jarimeCalculate = 0;
  let jarimeCalculateDay = 0;
  if (!jarimeDays == 0 || policyStatus == "no") {
    if (jarimeDays > 365 || policyStatus == "no") {
      jarimeDays = 365;
    }
    jarimeCalculate = (Base_price * jarimeDays) / 365;
    jarimeCalculateDay = jarimeCalculate / jarimeDays;
    // Base_price = Base_price + jarimeCalculate;
  }

  // محاسبه حداکثر تعهد مالی برای جبران خسارت
  let basePropertyDamage = 2510; //Mokhtalef
  let finalBaseProperty = 0;
  let alpha = 20 * basePropertyDamage
  let beta = 80 * basePropertyDamage / z40
  if (propertyDamage > 20 && propertyDamage < 41) {
    let baseProperty = propertyDamage - 20;
    let step1 = baseProperty * basePropertyDamage;
    finalBaseProperty = step1;
    Base_price = Base_price + step1;
  }
  if (propertyDamage > 40 && propertyDamage < 121) {
    let basePropertyStep2 = basePropertyDamage / z40;
    let base = propertyDamage - 40;
    let first = basePropertyStep2 * base;
    let step2 = first + alpha;
    finalBaseProperty = step2;
    Base_price = Base_price + step2;
  }
  if (propertyDamage > 120) {
    let basePropertyStep3 = basePropertyDamage / z120;
    let base = propertyDamage - 120;
    let first = basePropertyStep3 * base;
    let step3 = first + alpha + beta
    finalBaseProperty = step3;
    Base_price = Base_price + step3;
  }

  let Final_price = Base_price;
  Final_price = Final_price + Havades_ranande;

  if (policyStatus == "zero") {
    let price = Final_price * 0.95;
    Final_price = price;
  }

  // خودروهای بالای 15 سال ساخت به ازای هر سال 2درصد افزایش قیمت دارند
  if (oldCarBuild > 15) {
    let a = (+oldCarBuild - 15) * 2; // محاسبه عدد درصد
    let value = (+Final_price * +a) / 100; // محاسبه مقدار عددی افزایش
    Final_price = +Final_price + value;
  }
  let finalPriceWithoutMaaliat = Final_price;
  let maaliat = 0;
  maaliat = Final_price * 0.09;
  Final_price = Final_price + maaliat;
  Final_price = Final_price + jarimeCalculate;
  logger.log_info(
    "Jarime Dirkard: " +
      Math.round(jarimeCalculate) +
      "   " +
      " ThirdDiscount: " +
      ThirdDiscountCalculated +
      "   " +
      " HavadesRanande: " +
      Havades_ranande +
      "   " +
      "Maaliat: " +
      Math.round(maaliat) +
      "   " +
      " Final Price: " +
      Final_price
  );
  const data = {
    finalPrice: Math.ceil(Final_price),
    withoutMaaliat: Math.ceil(finalPriceWithoutMaaliat),
    maaliat: Math.ceil(maaliat),
    jarimeDays: Math.ceil(jarimeCalculate),
    jarimeCalculateDay: Math.ceil(jarimeCalculateDay),
    jarimeDaysDays: jarimeDays,
    thirdDiscount: ThirdDiscountCalculated,
    havadesFinal: Havades_ranande,
    finalBaseProperty: finalBaseProperty,
  };
  callback(null, data);
}

function thirdpartyCalculate(
  carType,
  carBrand,
  carModel,
  carCylinder,
  jarimeDays,
  carBuildYear,
  policyStatus,
  lastPolicyStartDate,
  lastPolicyExpDate,
  propertyDamage,
  carThirdDiscount,
  havadesDiscount,
  maaliDamage,
  jaaniDamage,
  havadesDamage,

  callback
) {
  logger.log_info(
    carType +
      " " +
      carBrand +
      " " +
      carModel +
      " " +
      carCylinder +
      " " +
      jarimeDays +
      " " +
      carBuildYear +
      " " +
      policyStatus +
      " " +
      lastPolicyStartDate +
      " " +
      lastPolicyExpDate +
      " " +
      propertyDamage +
      " " +
      carThirdDiscount +
      " " +
      havadesDiscount +
      " " +
      maaliDamage +
      " " +
      jaaniDamage +
      " " +
      havadesDamage
  );

  let Base_price = 0;
  let Havades_ranande = 0;
  let oldCarBuild = new Date().getFullYear() - carBuildYear; // محاسبه مقدار تفاوت سال ساخت با الان
  // Set Base Price From Car Data's

  // مرحله اول تعیین قیمت پایه و میزان جریمه دیرکرد براساس تایپ خودرو
  let basePropertyDamage = 0;
  let z1 = 0;
  let z2 = 0;
  let c32 = 0;
  let c96 = 0;
  if (
    (carType == "passenger" && carBrand == 21) ||
    carBrand == 16 ||
    carModel == 383661
  ) {
    Base_price = 2294300; // پیکان ، پراید ، رنو و هیلمن
    basePropertyDamage = 21300;
    z1 = 1.66406;
    z2 = 2.50588;
    c32 = 340800;
    c96 = 1160000;
    Havades_ranande = 252000
  } else if (carType == "passenger" && carCylinder < 4) {
    Base_price = 1937500; // قیمت پایه برای خودروهای ۳ سیلندر
    basePropertyDamage = 2;
  } else if (carType == "passenger" && carCylinder == 4) {
    Base_price = 2697100; // قیمت پایه برای خودروهای زیر ۴ سیلندر
    basePropertyDamage = 25100;
    Havades_ranande = 420000;
    z1 = 1.67333;
    z2 = 2.51;
    c32 = 401600;
    c96 = 1361600;
  } else if (carType == "passenger" && carCylinder > 4) {
    Base_price = 3018400; // قیمت پایه برای خودروهای ۶سیلندر به بالا
    Havades_ranande = 420000;
    basePropertyDamage = 28100;
    z1 = 1.67262;
    z2 = 2.50893;
    c32 = 449600;
    c96 = 1524800;
  } else if (carType == "motorcycle" && carCylinder == 0) {
    Base_price = 481000; // قیمت پایه برای موتورسیکلت گازی
    Havades_ranande = 220000;
  } else if (carType == "motorcycle" && carCylinder == 1) {
    Base_price = 587600; // قیمت پایه برای موتورسیکلت دنده ای ۱ سیلندر
    Havades_ranande = 220000;
  } else if (carType == "motorcycle" && carCylinder >= 2) {
    Base_price = 645500; // قیمت پایه برای موتورسیکلت دنده ای ۲ سیلندر به بالا
    Havades_ranande = 220000;
  } else if (carType == "motorcycle" && carCylinder == 20) {
    Base_price = 694200; // قیمت پایه برای موتورسیکلت دنده ای ۳چرخ یا سایدکار
    Havades_ranande = 220000;
  } else if (carType == "van" && carModel == 7) {
    Base_price = 5555400; // قیمت پایه برای خودرو ون تا ۷ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && (carModel == 9 || carModel == 8)) {
    Base_price = 5715900; // قیمت پایه برای خودرو ون تا ۹ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && carModel == 10) {
    Base_price = 5779600; // قیمت پایه برای خودرو ون تا ۱۰ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && carModel <= 16 && carModel >= 11) {
    Base_price = 7105400; // قیمت پایه برای خودرو مینی بوس تا ۱۶ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && carModel <= 21 && carModel >= 17) {
    Base_price = 7380700; // قیمت پایه برای خودرو مینی بوس تا ۲۱ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && carModel <= 27 && carModel >= 22) {
    Base_price = 10883700; // قیمت پایه برای خودرو اتوبوس تا ۲۷ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && carModel <= 40 && carModel >= 28) {
    Base_price = 13693300; // قیمت پایه برای خودرو اتوبوس تا ۴۰ نفره
    Havades_ranande = 600000
  } else if (carType == "van" && carModel <= 44 && carModel >= 41) {
    Base_price = 14532100; // قیمت پایه برای خودرو اتوبوس تا ۴۴ نفره
    Havades_ranande = 600000
  } else if (carType == "pickup" && carModel == 10) {
    Base_price = 2373500; // قیمت پایه برای خودرو بارکش تا ۱ تن
    Havades_ranande = 720000;
  } else if (carType == "pickup" && carModel == 13) {
    Base_price = 2858000; // قیمت پایه برای خودرو بارکش تا ۳ تن
    Havades_ranande = 720000;
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    (carModel == 35 || carModel == 4)
  ) {
    Base_price = 3617600; // قیمت پایه برای خودرو بارکش تا ۵ تن
    Havades_ranande = 720000
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    carModel == 510
  ) {
    Base_price = 4634800; // قیمت پایه برای خودرو بارکش تا ۱۰ تن
    Havades_ranande = 720000
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    carModel == 1020
  ) {
    Base_price = 5393300; // قیمت پایه برای خودرو بارکش تا ۲۰ تن
    Havades_ranande = 720000
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    carModel == 200
  ) {
    Base_price = 5715900; // قیمت پایه برای خودرو بارکش تا ۲۰ تن
    Havades_ranande = 720000
  }

  // محاسبه حداکثر تعهد مالی برای جبران خسارت
  let finalBaseProperty = 0;
  if (propertyDamage > 16 && propertyDamage < 33) {
    let baseProperty = propertyDamage - 16;
    let step1 = baseProperty * basePropertyDamage;
    finalBaseProperty = step1 / 10;
    Base_price = Base_price + finalBaseProperty;
  }

  if (propertyDamage > 32 && propertyDamage < 97) {
    let basePropertyStep2 = basePropertyDamage / z1;
    let base = propertyDamage - 32;
    let step1 = 16 * basePropertyDamage;
    let first = basePropertyStep2 * base;
    let step2 = first + c32;
    finalBaseProperty = step2 / 10;
    Base_price = Base_price + finalBaseProperty;
  }

  if (propertyDamage > 96) {
    let basePropertyStep3 = basePropertyDamage / z2;
    let base3 = propertyDamage - 96;
    let first3 = basePropertyStep3 * base3;
    let step2 = 32 * basePropertyDamage;
    let step3 = first3 + c96;
    finalBaseProperty = step3 / 10;
    Base_price = Base_price + finalBaseProperty;
  }

  // فرمول اصلی محاسبه شخص ثالث
  let base = Base_price;
  let takhfif = carThirdDiscount;
  let khesarat = 0;
  let takhfif_hr = havadesDiscount;
  let khesarat_hr = 0;
  let cal1 = 0;
  let cal2 = 0;
  let havadesRanande = Havades_ranande;
  let finalPrice = 0;

  // محاسبه خسارت
  if (maaliDamage || jaaniDamage) {
    if (jaaniDamage) {
      if (jaaniDamage === 2) {
        khesarat = 0.3;
      } else if (jaaniDamage === 3) {
        khesarat = 0.7;
      } else if (jaaniDamage === 4) {
        khesarat = 1;
      }
    } else {
      if (maaliDamage === 2) {
        khesarat = 0.2;
      } else if (maaliDamage === 3) {
        khesarat = 0.3;
      } else if (maaliDamage === 4) {
        khesarat = 0.4;
      }
    }
  }
  if (havadesDamage) {
    if (havadesDamage === 2) {
      khesarat_hr = 0.3;
    } else if (havadesDamage === 3) {
      khesarat_hr = 0.7;
    } else if (havadesDamage === 4) {
      khesarat_hr = 1;
    }
  }

  if (takhfif || khesarat) {
    cal1 = base * (1 - takhfif + khesarat);
    // logger.log_info("takhfif ya khesarat: " + cal1);
  } else {
    cal1 = base;
  }

  if (takhfif_hr || khesarat_hr) {
    cal2 = havadesRanande * (1 - takhfif_hr + khesarat_hr);
  } else {
    cal2 = havadesRanande;
  }
  logger.log_error(cal2);
  let cal3 = (cal1 + cal2) * 1.09;
  let cal5 = (cal1 + cal2) * 0.09;
  let cal4 = cal1 + cal2; // without maaliat
  let jarimeCalculateDay = 0;
  let jarimeCalculate = 0;
  finalPrice = cal3;
  // محاسبه جریمه دیرکرد
  if (!jarimeDays == 0 || policyStatus == "no") {
    if (jarimeDays > 365 || policyStatus == "no") {
      jarimeDays = 365;
    }
    jarimeCalculate = (Base_price * jarimeDays) / 365;
    jarimeCalculateDay = jarimeCalculate / jarimeDays;
    finalPrice = finalPrice + jarimeCalculate;
  }

  // خودروهای بالای 15 سال ساخت به ازای هر سال 2درصد افزایش قیمت دارند
  if (oldCarBuild > 15) {
    let a = (oldCarBuild - 15) * 0.02; // محاسبه عدد درصد
    let value = (1 + a) * cal3; // محاسبه مقدار عددی افزایش
    finalPrice = value;
    // logger.log_info("final-price: " + value);
    // logger.log_info("oldCar: " + value);
  }

  // logger.log_info("cal3: " + cal3);
  // logger.log_info("finalPrice: " + finalPrice);
  // finalPrice = finalPrice + cal3;

  if (policyStatus == "yes") {
    finalPrice = finalPrice * 0.975; // تخفیف ۵درصدی برای خرید نقدی(همیشه)
  }

  // logger.log_info(cal3);
  const data = {
    finalPrice: Math.ceil(finalPrice),
    withoutMaliaat: Math.ceil(cal4),
    maaliat: Math.ceil(cal5),
    havadesFinal: Math.ceil(cal2),
    BaseProperty: finalBaseProperty,
    jarimeSum: Math.ceil(jarimeCalculate),
    jarimePerDay: Math.ceil(jarimeCalculateDay),
    jarimeDays: Math.ceil(jarimeDays),
  };
  callback(null, data);
}

function thirdpartyPriceCalculate2(
  carType,
  carBrand,
  carModel,
  carCylinder,
  jarimeDays,
  carBuildYear,
  policyStatus,
  lastPolicyStartDate,
  lastPolicyExpDate,
  propertyDamage,
  carThirdDiscount,
  havadesDiscount,
  maaliDamage,
  jaaniDamage,
  havadesDamage,

  callback
) {
  let Base_price = 0;
  let Havades_ranande = 336000;
  let oldCarBuild = new Date().getFullYear() - carBuildYear; // محاسبه مقدار تفاوت سال ساخت با الان
  // Set Base Price From Car Data's
  // مرحله اول تعیین قیمت پایه و میزان جریمه دیرکرد براساس تایپ خودرو
  let basePropertyDamage = 0;
  let z1 = 0;
  let z2 = 0;
  let c32 = 0;
  let c96 = 0;
  if (
    (carType == "passenger" && carBrand == 21) ||
    carBrand == 16 ||
    carModel == 383661
  ) {
    Base_price = 2294300; // پیکان ، پراید ، رنو و هیلمن
    basePropertyDamage = 21300;
    z1 = 1.66406;
    z2 = 2.50588;
    c32 = 340800;
    c96 = 1160000;
  } else if (carType == "passenger" && carCylinder < 4) {
    Base_price = 1937500; // قیمت پایه برای خودروهای ۳ سیلندر
    basePropertyDamage = 2;
  } else if (carType == "passenger" && carCylinder == 4) {
    Base_price = 2697100; // قیمت پایه برای خودروهای زیر ۴ سیلندر
    basePropertyDamage = 25100;
    z1 = 1.67333;
    z2 = 2.51;
    c32 = 401600;
    c96 = 1361600;
  } else if (carType == "passenger" && carCylinder >= 6) {
    Base_price = 3018400; // قیمت پایه برای خودروهای ۶سیلندر به بالا
  } else if (carType == "motorcycle" && carCylinder == 0) {
    Base_price = 481000; // قیمت پایه برای موتورسیکلت گازی
  } else if (carType == "motorcycle" && carCylinder == 1) {
    Base_price = 587600; // قیمت پایه برای موتورسیکلت دنده ای ۱ سیلندر
  } else if (carType == "motorcycle" && carCylinder >= 2) {
    Base_price = 645500; // قیمت پایه برای موتورسیکلت دنده ای ۲ سیلندر به بالا
  } else if (carType == "motorcycle" && carCylinder == 20) {
    Base_price = 694200; // قیمت پایه برای موتورسیکلت دنده ای ۳چرخ یا سایدکار
  } else if (carType == "van" && carModel == 7) {
    Base_price = 5555400; // قیمت پایه برای خودرو ون تا ۷ نفره
  } else if (carType == "van" && (carModel == 9 || carModel == 8)) {
    Base_price = 5715900; // قیمت پایه برای خودرو ون تا ۹ نفره
  } else if (carType == "van" && carModel == 10) {
    Base_price = 5779600; // قیمت پایه برای خودرو ون تا ۱۰ نفره
  } else if (carType == "van" && carModel <= 16 && carModel >= 11) {
    Base_price = 7105400; // قیمت پایه برای خودرو مینی بوس تا ۱۶ نفره
  } else if (carType == "van" && carModel <= 21 && carModel >= 17) {
    Base_price = 7380700; // قیمت پایه برای خودرو مینی بوس تا ۲۱ نفره
  } else if (carType == "van" && carModel <= 27 && carModel >= 22) {
    Base_price = 10883700; // قیمت پایه برای خودرو اتوبوس تا ۲۷ نفره
  } else if (carType == "van" && carModel <= 40 && carModel >= 28) {
    Base_price = 13693300; // قیمت پایه برای خودرو اتوبوس تا ۴۰ نفره
  } else if (carType == "van" && carModel <= 44 && carModel >= 41) {
    Base_price = 14532100; // قیمت پایه برای خودرو اتوبوس تا ۴۴ نفره
  } else if (carType == "pickup" && carModel == 10) {
    Base_price = 2373500; // قیمت پایه برای خودرو بارکش تا ۱ تن
  } else if (carType == "pickup" && carModel == 13) {
    Base_price = 2858000; // قیمت پایه برای خودرو بارکش تا ۳ تن
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    (carModel == 35 || carModel == 4)
  ) {
    Base_price = 3617600; // قیمت پایه برای خودرو بارکش تا ۵ تن
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    carModel == 510
  ) {
    Base_price = 4634800; // قیمت پایه برای خودرو بارکش تا ۱۰ تن
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    carModel == 1020
  ) {
    Base_price = 5393300; // قیمت پایه برای خودرو بارکش تا ۲۰ تن
  } else if (
    (carType == "pickup" || carType == "truck" || carType == "carrier") &&
    carModel == 200
  ) {
    Base_price = 5715900; // قیمت پایه برای خودرو بارکش تا ۲۰ تن
  }

  let ThirdDiscountCalculated = 0;

  // محاسبه جریمه دیرکرد
  let jarimeCalculate = 0;
  let jarimeCalculateDay = 0;
  if (!jarimeDays == 0 || policyStatus == "no") {
    if (jarimeDays > 365 || policyStatus == "no") {
      jarimeDays = 365;
    }
    jarimeCalculate = (Base_price * jarimeDays) / 365;
    jarimeCalculateDay = jarimeCalculate / jarimeDays;
    // Base_price = Base_price + jarimeCalculate;
  }

  // محاسبه حداکثر تعهد مالی برای جبران خسارت

  let finalBaseProperty = 0;
  if (propertyDamage > 16 && propertyDamage < 33) {
    let baseProperty = propertyDamage - 16;
    let step1 = baseProperty * basePropertyDamage;
    finalBaseProperty = step1;
    Base_price = Base_price + step1;
  }
  if (propertyDamage > 32 && propertyDamage < 97) {
    let basePropertyStep2 = basePropertyDamage / z1;
    let base = propertyDamage - 32;
    let first = basePropertyStep2 * base;
    let step2 = first + c32;
    finalBaseProperty = step2;
    Base_price = Base_price + step2;
  }
  if (propertyDamage > 96) {
    let basePropertyStep3 = basePropertyDamage / z2;
    let base = propertyDamage - 96;
    let first = basePropertyStep3 * base;
    let step3 = first + c96;
    finalBaseProperty = step3;
    Base_price = Base_price + step3;
  }

  let Final_price = Base_price;

  Final_price = Final_price + Havades_ranande;
  // خودروهای بالای 15 سال ساخت به ازای هر سال 2درصد افزایش قیمت دارند
  if (oldCarBuild > 15) {
    let a = (+oldCarBuild - 15) * 2; // محاسبه عدد درصد
    let value = (+Final_price * +a) / 100; // محاسبه مقدار عددی افزایش
    Final_price = +Final_price + value;
  }
  let finalPriceWithoutMaaliat = Final_price;
  let maaliat = 0;
  maaliat = Final_price * 0.09;
  Final_price = Final_price + maaliat;
  Final_price = Final_price + jarimeCalculate;
  logger.log_info(
    "Jarime Dirkard: " +
      Math.round(jarimeCalculate) +
      "   " +
      " ThirdDiscount: " +
      ThirdDiscountCalculated +
      "   " +
      " HavadesRanande: " +
      Havades_ranande +
      "   " +
      "Maaliat: " +
      Math.round(maaliat) +
      "   " +
      " Final Price: " +
      Final_price
  );
  const data = {
    finalPrice: Math.ceil(Final_price),
    withoutMaaliat: Math.ceil(finalPriceWithoutMaaliat),
    maaliat: Math.ceil(maaliat),
    jarimeDays: Math.ceil(jarimeCalculate),
    jarimeCalculateDay: Math.ceil(jarimeCalculateDay),
    jarimeDaysDays: jarimeDays,
    thirdDiscount: ThirdDiscountCalculated,
    havadesFinal: Havades_ranande,
    finalBaseProperty: finalBaseProperty,
  };
  callback(null, data);
}

exports.getCarBodyoffers = function (req, res) {
  try {
    if (!req.body.carValue) return apiResponse.sendBadRequest(res);
    let carBrand = req.body.carBrand;
    let carModel = req.body.carModel;
    let carUsage = req.body.carUsage;
    let carIsIrani = req.body.carIsIrani;
    let carProductionYear = req.body.carProductionYear;
    let carValue = req.body.carValue;
    let carAccessoriesValue = req.body.carAccessoriesValue;
    let policyStatus = req.body.policyStatus;
    let disBody = req.body.disBody;
    let disThirdParty = req.body.disThirdParty;
    let coverChemical = req.body.coverChemical;
    let coverGlassBreak = req.body.coverGlassBreak;
    let coverNaturalDisasters = req.body.coverNaturalDisasters;
    let coverTransportation = req.body.coverTransportation;
    let coverPriceFluctuation = req.body.coverPriceFluctuation;
    let coverTheftOfParts = req.body.coverTheftOfParts;
    carBodyPrice(
      carBrand,
      carModel,
      carUsage,
      carIsIrani,
      carProductionYear,
      carValue,
      carAccessoriesValue,
      policyStatus,
      disBody,
      disThirdParty,
      coverChemical,
      coverGlassBreak,
      coverNaturalDisasters,
      coverTransportation,
      coverPriceFluctuation,
      coverTheftOfParts,
      function (error, price) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          logger.log_info(price.final)
          return apiResponse.sendSucces(res, price);
        }
      }
    );
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

function carBodyPrice(
  carBrand,
  carModel,
  carUsage,
  carIsIrani,
  carProductionYear,
  carValue,
  carAccessories,
  policyStatus,
  disBody,
  disThirdParty,
  coverChemical,
  coverGlassBreak,
  coverNaturalDisasters,
  coverTransportation,
  coverPriceFluctuation,
  coverTheftOfParts,

  callback
) {
  let Alpha = 0;
  let Beta = 0;
  let disGroup = 0;
  let oldCarBuild = new Date().getFullYear() - carProductionYear; // محاسبه مقدار تفاوت سال ساخت با الان
  logger.log_info(coverPriceFluctuation);

  if (carValue < 500000000) {
    Alpha = 4097560.976;
    Beta = 0.0082;
    disGroup = 0.45;
  } else if (carValue >= 500000000 && carValue < 1000000000) {
    Alpha = 7148936.17;
    Beta = 0.0047;
    disGroup = 0.1;
  } else if (carValue >= 1000000000) {
    Alpha = 1050000.0;
    Beta = 0.032;
    disGroup = 0.15;
  }

  // فرمول اصلی بیمه بدنه
  let f1 = (carValue - Alpha) * Beta + 33600;
  let f2 = (carAccessories - Alpha) * Beta + 33600;
  let f3 = (carValue + carAccessories - Alpha) * Beta + 33600;

  // محاسبه پوشش های اضافی
  let covers = 0;
  if (coverChemical) {
    covers = 0.05;
  }
  if (coverGlassBreak) {
    covers = covers + 0.05;
  }
  if (coverNaturalDisasters) {
    covers = covers + 0.05;
  }
  if (coverTransportation) {
    covers = covers + 0.05;
  }
  if (coverPriceFluctuation == 25) {
    covers = covers + 0.15;
  }
  if (coverPriceFluctuation == 50) {
    covers = covers + 0.25;
  }
  if (coverPriceFluctuation == 100) {
    covers = covers + 0.4;
  }
  if (coverTheftOfParts == 10) {
    covers = covers + 0.1;
  }
  if (coverTheftOfParts == 20) {
    covers = covers + 0.2;
  }
  let c4 = f3 * covers;
  logger.log_info("c4: " + c4);
  // محاسبه سال ساخت بالای ۱۰ سال یا ضریب کهنگی
  let l1 = 0;
  if (oldCarBuild > 9) {
    l1 = oldCarBuild - 10;
    l1 = l1 * 0.05;
    logger.log_info("l1 cal:" + l1);
  }

  // تخفیف خودروی صفر کیلومتر
  let p1 = 0;
  if (policyStatus == "zero") {
    p1 = 0.2;
  }

  // محاسبه تخفیف بیمه نامه بدنه قبلی
  if (disBody > 0) {
    if (disBody == 1) {
      disBody = 0.25;
    }
    if (disBody == 2) {
      disBody = 0.35;
    }
    if (disBody == 3) {
      disBody = 0.45;
    }
    if (disBody > 3) {
      disBody = 0.6;
    }
  }

  let cal1 = f1 * 0.3;
  let cal2 = f2 * 0.3;
  let cal3 = c4 * 0.3;

  // اعمال ضریب کهنگی‍
  f1 = f1 * (1 + l1);
  c4 = c4 * (1 + l1);

  // اعمال تخفیف صفرکیلومتر
  f1 = f1 * (1 - p1);
  f2 = f2 * (1 - p1);

  // اعمال سابقه خطرات اصلی
  f1 = f1 * (1 - disBody);
  f2 = f2 * (1 - disBody);
  c4 = c4 * (1 - disBody);

  // اعمال تخفیف گروهی
  f1 = f1 * (1 - disGroup);
  f2 = f2 * (1 - disGroup);
  c4 = c4 * (1 - disGroup);

  // اعمال تخفیف ثالث
  f1 = f1 * (1 - disThirdParty);
  f2 = f2 * (1 - disThirdParty);
  c4 = c4 * (1 - disThirdParty);

  // مقایسه حداکثر تخفیف ۷۰درصدی
  if (cal1 > f1) {
    f1 = cal1;
  }
  if (cal2 > f2) {
    f2 = cal2;
  }
  if (cal3 > c4) {
    c4 = cal3;
  }

  // اعمال تخفیف خرید نقدی
  let final = f1 + f2 + c4;
  final = final * (1 - 0.1);

  // اعمال مالیات
  final = final * (1 + 0.09);
  logger.log_info(final)
  const data = {
    covers: Math.ceil(c4),
    final: Math.ceil(final),
    f1: f1,
    f2: f2,
    c4: c4,
  };
  callback(null, data);
}

// base api controller
exports.getFireInsoffers = function (req, res) {
  try {
    if (!req.body.buildingMeter) return apiResponse.sendBadRequest(res);
    let buildingMeter = req.body.buildingMeter;
    let buildingPricePerMeter = req.body.buildingPricePerMeter;
    let buildingPropertiesValue = req.body.buildingPropertiesValue;
    let coverTheftByBreak = req.body.coverTheftByBreak;
    let coverPipeBreak = req.body.coverPipeBreak;
    let coverSubsidenceLandslide = req.body.coverSubsidenceLandslide;
    let coverEarthquake = req.body.coverEarthquake;
    let coverRainSnowDamage = req.body.coverRainSnowDamage;
    let coverFlood = req.body.coverFlood;
    let coverStorm = req.body.coverStorm;
    let coverAvalanche = req.body.coverAvalanche;
    let coverHeavySnow = req.body.coverHeavySnow;

    fireInsuranceCalculate(
      buildingMeter,
      buildingPricePerMeter,
      buildingPropertiesValue,
      coverTheftByBreak, // پوشش سرقت
      coverPipeBreak, // شکستن لوله
      coverSubsidenceLandslide, // نشست و رانش زمین
      coverEarthquake, // زلزله
      coverRainSnowDamage, //ضایعات ناشی از آب باران و برف
      coverFlood, // سیل
      coverStorm, // طوفان
      coverAvalanche, // ریزش بهمن
      coverHeavySnow, // ریزش سقف در اثر سنگینی برف
      function (error, price) {
        if (error) {
          apiResponse.sendInternalError(res, error);
        } else {
          return apiResponse.sendSucces(res, price);
        }
      }
    );
  } catch (error) {
    logger.log_error(error);
    apiResponse.sendInternalError(res, error);
  }
};

function fireInsuranceCalculate(
  buildingMeter,
  buildingPricePerMeter,
  buildingPropertiesValue,
  coverTheftByBreak, // پوشش سرقت
  coverPipeBreak, // شکستن لوله
  coverSubsidenceLandslide, // نشست و رانش زمین
  coverEarthquake, // زلزله
  coverRainSnowDamage, //ضایعات ناشی از آب باران و برف
  coverFlood, // سیل
  coverStorm, // طوفان
  coverAvalanche, // ریزش بهمن
  coverHeavySnow, // ریزش سقف در اثر سنگینی برف

  callback
) {
  let basePrice = 0.00011;
  let x = 0;
  let m = 0;
  let n = 0;
  let cover = 0;
  let TheftByBreak = 99.5;
  let PipeBreak = 2;
  let SubsidenceLandslide = 10.95;
  let Earthquake = 4.5;
  let RainSnowDamage = 2;
  let Flood = 2;
  let Storm = 2;
  let Avalanche = 4;
  let HeavySnow = 2;
  let xa = buildingMeter * parseInt(buildingPricePerMeter);
  let xb = xa + parseInt(buildingPropertiesValue);
  x = basePrice * xb;

  logger.log_info(
    buildingPropertiesValue + " " + buildingMeter + " " + buildingPricePerMeter
  );

  if (coverTheftByBreak === "true") {
    n += 1;
    cover += TheftByBreak;
  }
  if (coverPipeBreak === "true") {
    n += 1;
    cover += PipeBreak;
  }
  if (coverSubsidenceLandslide === "true") {
    n += 1;
    cover += SubsidenceLandslide;
  }
  if (coverEarthquake === "true") {
    n += 1;
    cover += Earthquake;
  }
  if (coverRainSnowDamage === "true") {
    n += 1;
    cover += RainSnowDamage;
  }
  if (coverFlood === "true") {
    n += 1;
    cover += Flood;
  }
  if (coverStorm === "true") {
    n += 1;
    cover += Storm;
  }
  if (coverAvalanche === "true") {
    n += 1;
    cover += Avalanche;
  }
  if (coverHeavySnow === "true") {
    n += 1;
    cover += HeavySnow;
  }

  if (cover) {
    // let z = cover - (n + 1);
    let f = x * (n - 1);
    let g = x * cover - f;
    m = g;
    logger.log_info("in if statement: " + g);
  } else {
    m = x;
    logger.log_info(m);
  }
  callback(null, Math.ceil(m));
}

//base api controller
// exports.getThirdPartyoffers = function (req, res) {
//     try {
//       if (!req.body.type) return apiResponse.sendBadRequest(res);
//       authManager.authentication(req, res, function (accountId) {

//       });
//     } catch (error) {
//       logger.log_error(error);
//       apiResponse.sendInternalError(res, error);
//     }
//   };
