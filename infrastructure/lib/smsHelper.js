const melipayamak = require("melipayamak");
// const { logger } = require("..");
// const logger = require("infrastructure").logger;
const smsApiUsername = process.env.ALIBIME_SMS_API_USER_NAME;
const smsApiPassword = process.env.ALIBIME_SMS_API_PASSWORD;
const smsApiPhoneNumber = process.env.ALIBIME_SMS_API_PHONE_NUMBER;

class smsHelper {
  constructor() {
    this.api = new melipayamak(String(smsApiUsername), String(smsApiPassword));

    this.smsRest = this.api.sms();
  }

  sendOTP(mobilePhone, code) {
    return new Promise((resolve, reject) => {
      try {
        let message = String(code);
        this.smsRest
          .sendByBaseNumber(message, String(mobilePhone), 68163)
          .then((res) => {
            //{ Value: '5164118199855462449', RetStatus: 1, StrRetStatus: 'Ok' }
            if (res.RetStatus == 1) resolve();
            else reject(res);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  sendAfterRegOrder(mobilePhone, code) {
    return new Promise((resolve, reject) => {
      try {
        const isflash = false;
        this.smsRest
          .sendByBaseNumber(code, String(mobilePhone), 79123)
          .then((res) => {
            //{ Value: '5164118199855462449', RetStatus: 1, StrRetStatus: 'Ok' }
            if (res.RetStatus == 1) resolve();
            else reject(res);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  sendAfterPay(mobilePhone, code) {
    return new Promise((resolve, reject) => {
      try {
        const isflash = false;
        this.smsRest
          .sendByBaseNumber(code, String(mobilePhone), 79124)
          .then((res) => {
            //{ Value: '5164118199855462449', RetStatus: 1, StrRetStatus: 'Ok' }
            if (res.RetStatus == 1) resolve();
            else reject(res);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  sendChangeStatus(mobilePhone, code, status) {
    return new Promise((resolve, reject) => {
      try {
        const isflash = false;
        let text = [code, status];
        this.smsRest
          .sendByBaseNumber(text, String(mobilePhone), 79125)
          .then((res) => {
            //{ Value: '5164118199855462449', RetStatus: 1, StrRetStatus: 'Ok' }
            if (res.RetStatus == 1) resolve();
            else reject(res);
          })
          .catch((err) => {
            reject(err);
          });
      } catch (error) {
        reject(error);
      }
    });
  }
  // <<<<<<< HEAD
  //   // sendReminder(mobilePhone, dueDate) {
  //   //   return new Promise((resolve, reject) => {
  //   //     try {
  //   //       let message = "تاریخ اتمام بیمه شما : " + String(dueDate);
  //   //       this.smsRest
  //   //         .send(String(mobilePhone), String(smsApiPhoneNumber), message, false)
  //   //         .then((res) => {
  //   //           if (res.RetStatus == 1) resolve();
  //   //           else reject(res);
  //   //         })
  //   //         .catch((err) => {
  //   //           reject(err);
  //   //         });
  //   //     } catch (error) {
  //   //       reject(error);
  //   //     }
  //   //   });
  //   // }
  // =======
  //   sendReminder(mobilePhone, dueDate) {
  //     return new Promise((resolve, reject) => {
  //       try {
  //         let message = "تاریخ اتمام بیمه شما : " + String(dueDate);
  //         this.smsApi
  //           .send(String(mobilePhone), String(smsApiPhoneNumber), message, false)
  //           .then((res) => {
  //             if (res.RetStatus == 1) resolve();
  //             else reject(res);
  //           })
  //           .catch((err) => {
  //             reject(err);
  //           });
  //       } catch (error) {
  //         reject(error);
  //       }
  //     });
  //   }
  // >>>>>>> 21a71615526019ac9f05eebb32462e005f241798
}

module.exports = smsHelper;