const ROLES = [
  { value: "superAdmin", text: "superAdmin" },
  { value: "powerAdmin", text: "powerAdmin" },
  { value: "admin", text: "admin" },
  { value: "blog", text: "blog" },
  { value: "user", text: "user" },
];

const CAR_THIRD_DISCONTS = [
  { value: 1, text: "صفر درصد", count: 0 },
  { value: 2, text: "5 درصد", count: 5 },
  { value: 3, text: "10 درصد", count: 10 },
  { value: 4, text: "15 درصد", count: 15 },
  { value: 5, text: "20 درصد", count: 20 },
  { value: 6, text: "25 درصد", count: 25 },
  { value: 7, text: "30 درصد", count: 30 },
  { value: 8, text: "35 درصد", count: 35 },
  { value: 9, text: "40 درصد", count: 40 },
  { value: 10, text: "45 درصد", count: 45 },
  { value: 11, text: "50 درصد", count: 50 },
  { value: 12, text: "55 درصد", count: 55 },
  { value: 13, text: "60 درصد", count: 60 },
  { value: 14, text: "65 درصد", count: 65 },
  { value: 15, text: "70 درصد", count: 70 },
];

const CAR_THIRD_LIFE_DAMAGES = [
  { value: 1, text: "فاقد خسارت جانی", count: 0 },
  { value: 2, text: "یک بار خسارت جانی", count: 20 },
  { value: 3, text: "دو بار خسارت جانی", count: 30 },
  { value: 4, text: "سه بار خسارت جانی و یا بیشتر", count: 40 },
];

const CAR_THIRD_FINANCIAL_DAMAGES = [
  { value: 1, text: "فاقد خسارت مالی", count: 0 },
  { value: 2, text: "یک بار خسارت مالی", count: 30 },
  { value: 3, text: "دو بار خسارت مالی", count: 70 },
  { value: 4, text: "سه بار خسارت مالی و یا بیشتر", count: 100 },
];

const CAR_BODY_DISCOUNTS = [
  { value: 1, text: "با خسارت", count: 0 },
  { value: 2, text: "یک سال", count: 25 },
  { value: 3, text: "دو سال", count: 35 },
  { value: 4, text: "سه سال", count: 45 },
  { value: 5, text: "چهار سال یا بیشتر", count: 60 },
];

class enumHelper {
  constructor() {}

  isValidRole(role = null) {
    if (role === null) return false;
    let index = ROLES.findIndex((item) => {
      return item.value === role;
    });
    return index !== -1 ? true : false;
  }

  getCarThirdDiscontCount(value = 0) {
    if (value === 0) return 0;
    let obj = CAR_THIRD_DISCONTS.find((item) => {
      return Number(item.value) === Number(value);
    });
    return obj !== -1 ? obj.count : 0;
  }

  getCarThirdLifeDamageCount(value = 0) {
    if (value === 0) return 0;
    let obj = CAR_THIRD_LIFE_DAMAGES.find((item) => {
      return Number(item.value) === Number(value);
    });
    return obj !== -1 ? obj.count : 0;
  }

  getCarThirdFinancialDamageCount(value = 0) {
    if (value === 0) return 0;
    let obj = CAR_THIRD_FINANCIAL_DAMAGES.find((item) => {
      return Number(item.value) === Number(value);
    });
    return obj !== -1 ? obj.count : 0;
  }

  getCarBodyDiscontCount(value = 0) {
    if (value === 0) return 0;
    let obj = CAR_BODY_DISCOUNTS.find((item) => {
      return Number(item.value) === Number(value);
    });
    return obj !== -1 ? obj.count : 0;
  }
}

module.exports = enumHelper;
