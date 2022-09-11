"use strict";

module.exports = function (app) {
  const reminderController = require("../controllers/reminderController");

  app.route("/v1/reminder").get(reminderController.getsAllReminders);
  app.route("/v1/reminder").post(reminderController.addNewReminder);
  app.route("/v1/reminder").put(reminderController.updateReminder);
  app.route("/v1/reminder/:_id").delete(reminderController.deleteReminder);
};
