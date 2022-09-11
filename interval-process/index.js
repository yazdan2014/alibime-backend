const logger = require("infrastructure").logger;
const database = require("database");
const checkReminders = require("./lib/checkReminders");

function intervalManager() {
  //   initial();
  this.startInterval = startInterval;
}

function initial() {
  return connectToDatabase();
}

function connectToDatabase(count = 0) {
  return new Promise((resolve) => {
    database
      .connect()
      .then(() => {
        return resolve();
      })
      .catch((err) => {
        err = err;
        console.log("try to connect ... " + count);
        return resolve(connectToDatabase(++count));
      });
  });
}

const startInterval = function () {
  initial().then(() => {
    createReminderInterval();
  });
};

function createReminderInterval() {
  runCheckReminder();
  this.intervalObject = setInterval(runCheckReminder, 5 * 1000);
}

function runCheckReminder() {
  checkReminders();
}

module.exports = new intervalManager();
