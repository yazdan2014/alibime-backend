const logger = require("infrastructure").logger;
const dateHelper = require("infrastructure").dateHelper;
const smsHelper = require("infrastructure").smsHelper;
const reminders = require("database").reminders;
const momentJalaali = require("moment-jalaali");

function checkReminders() {
  reminders.getsAll(0, 100, function (error, result) {
    if (error) {
      logger.log_error(error);
    } else {
      result.forEach((item) => {
        let diff = dateHelper.getDiiferenceInSecond(item.dueDate, new Date());
        // console.log(diff);
        if (0 < diff && diff <= 10) {
          let date = momentJalaali(item.dueDate).format("jYYYY/jMM/jDD");
          // smsHelper
          //   .sendReminder(item.mobilePhone, date)
          //   .then((result) => {
          //     reminders.updateStatus(item._id, 1, function (error, result) {
          //       if (error) {
          //         logger.log_error(error);
          //       } else {
          //         logger.log_info("send reminders to : ", item.mobilePhone);
          //       }
          //     });
          //   })
          //   .catch((error) => {
          //     logger.log_error(error);
          //   });
          smsHelper.sendReminder(item.mobilePhone, date);
          reminders.updateStatus(item._id, 1, function (error, result) {
            if (error) {
              logger.log_error(error);
            } else {
              logger.log_info("send reminders to : " + item.mobilePhone);
            }
          });
        } else if (diff < 0) {
          reminders.updateStatus(item._id, 1, function (error, result) {
            if (error) {
              logger.log_error(error);
            } else {
            }
          });
        }
      });
    }
  });
}

module.exports = checkReminders;
