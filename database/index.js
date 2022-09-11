const databaseManager = require("./lib/dataBaseManager").getInstance();

const adminRepository = require("./lib/repositories/adminRepository");
const accountRepository = require("./lib/repositories/accountRepository");
const reminderRepository = require("./lib/repositories/reminderRepository");
const orderRepository = require("./lib/repositories/orderRepository");
const carRepository = require("./lib/repositories/carRepository");
const paymentRepository = require("./lib/repositories/paymentRepository");

const adminModels = require("./lib/models/adminModel");
const userModels = require("./lib/models/accountModel");
const reminderModels = require("./lib/models/reminderModel");
const orderModels = require("./lib/models/orderModel");
const carModels = require("./lib/models/carModel");
const paymentModels = require("./lib/models/paymentModel");

function connect() {
  return databaseManager.connect();
}

function disconnect() {
  return databaseManager.disconnect();
}

const admins = new adminRepository();
const users = new accountRepository();
const reminders = new reminderRepository();
const orders = new orderRepository();
const cars = new carRepository();
const payments = new paymentRepository();

module.exports = {
  connect: connect,
  disconnect: disconnect,

  admins: admins,
  users: users,
  reminders: reminders,
  orders: orders,
  cars: cars,
  payments: payments,

  adminModel: adminModels.adminModel,
  adminNewModel: adminModels.adminNewModel,
  accountModel: userModels.accountModel,
  accountEditRoleModel: userModels.accountEditRoleModel,
  reminderModel: reminderModels.reminderModel,
  reminderEditRedSectionModel: reminderModels.reminderEditRedSectionModel,
  // orderModel: orderModels.orderModel,
  orderNewModel: orderModels.orderNewModel,
  carBodyOrderModel: orderModels.carBodyOrderModel,
  carBodyUpdateOrderModel: orderModels.carBodyUpdateOrderModel,
  orderEditImageUrlModel: orderModels.orderEditImageUrlModel,
  orderEditStatusModel: orderModels.orderEditStatusModel,
  orderEditRedSectionModel: orderModels.orderEditRedSectionModel,
  carTypeModel: carModels.carTypeModel,
  carBrandModel: carModels.carBrandModel,
  carModelModel: carModels.carModelModel,
  carPriceModel: carModels.carPriceModel,
  editRedSectionModel: carModels.editRedSectionModel,
  payNewModel: paymentModels.payNewModel,
  payUpdateModel: paymentModels.payUpdateModel,
};
