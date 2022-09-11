"use strict";

module.exports = function (app) {
  const adminController = require("../controllers/adminController");

  app.route("/v1/admin/otp/login").post(adminController.sendSms);
  app.route("/v1/admin/otp/confirm").post(adminController.confirmCode);
  app.route("/v1/admin/addnew").post(adminController.addNewAdmin);
  app.route("/v1/admin/:_username").delete(adminController.deleteAdmin);
  app.route("/v1/admin/otp/info").get(adminController.getInfo);
  app.route("/v1/admin/otp/logout").get(adminController.logout);
  app.route("/v1/admin/orders").get(adminController.getAllOrders);
  app
    .route("/v1/admin/orderdetail/:_id")
    .get(adminController.getOrderByTrackId);
  app.route("/v1/admin/order/:_id").get(adminController.getOrderById);
  app.route("/v1/admin/transactions").get(adminController.getAllTransactions);
  app
    .route("/v1/admin/transactions/:_id")
    .get(adminController.getTransByOrderId);
  app.route("/v1/admin/trans/:_transid").get(adminController.getTransById);

  app.route("/v1/admin/24/accounts").get(adminController.get24NewAcc);
  app.route("/v1/admin/24/transactions").get(adminController.get24NewTrans);
  app.route("/v1/admin/24/tickets").get(adminController.get24NewTickets);
  app.route("/v1/admin/24/orders").get(adminController.get24NewOrders);

  app.route("/v1/admin/list").get(adminController.getAllAdmins);

  app.route("/v1/admin/allusers").get(adminController.getAllUsers);

  app
    .route("/v1/admin/orders/changestatus")
    .post(adminController.changeStatusById);
  app
    .route("/v1/admin/downloadImage/:imageName")
    .get(adminController.downloadImage);

  app.route("/v1/admin/order/:_id").delete(adminController.deleteOrder);
};
