const urlRequestOTP = "/admin/otp/login";
const urlConfirmOTP = "/admin/otp/confirm";
const urlGetAdminInfo = "/admin/otp/info";
const urlLogout = "/admin/logout";
const urlOrders = "/admin/orders";
const urlAllAdmins = "/admin/list";
const urlAllUsers = "admin/allusers";
const urlTrans = "/admin/transactions";
const urlGetOrderById = "/admin/order/{orderId}";
const urlGetTransById = "/admin/transactions/{orderId}";
const urlGetOrderByTrackId = "/admin/orderdetail/{orderId}";
const urlGetTransBytransId = "/admin/trans/{transid}";
const urlOrderStatus = "/admin/orders/changestatus";
const urlDeleteOrder = "/admin/order/{_id}";
const urlAddNewAdmin = "/admin/addnew";
const urlDeleteAdmin = "/admin/{_username}";
const url24Trans = "/admin/24/transactions";
const url24Orders = "/admin/24/orders";
const url24Tickets = "/admin/24/tickets";
const url24Accs = "/admin/24/accounts";
const urlDownloadImageOrder = "/admin/downloadImage/{imageName}";

export default ({ app }, inject) => {
  inject("api", {
    requestOTP({ username, password }) {
      return new Promise((resolve, reject) => {
        app.$axios
          .$post(urlRequestOTP, {
            username,
            password,
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    confirmOTP({ username, confirmationCode, tempToken }) {
      return new Promise((resolve, reject) => {
        app.$axios
          .$post(urlConfirmOTP, {
            username,
            confirmationCode,
            tempToken,
          })
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getInfo() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(urlGetAdminInfo)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    logout() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$post(urlLogout)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getOrders() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(urlOrders)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getOrderbyID(_id) {
      const url = String(urlGetOrderById).replace("{orderId}", _id);
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$get(url)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getOrderbyTrackID(_id) {
      const url = String(urlGetOrderByTrackId).replace("{orderId}", _id);
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$get(url)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getTrans() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(urlTrans)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getTransactionbyID(_id) {
      const url = String(urlGetTransById).replace("{orderId}", _id);
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$get(url)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getTransactionbyTransID(_transid) {
      const url = String(urlGetTransBytransId).replace("{transid}", _transid);
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$get(url)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    orderStatusById(data) {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$post(urlOrderStatus, data)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    deleteOrderById(_id) {
      const url = String(urlDeleteOrder).replace("{_id}", _id);
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$delete(url)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    deleteAdminByUsername(username) {
      const url = String(urlDeleteAdmin).replace("{_username}", username);
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "x-access-token": app.store.state.auth.token,
            },
          })
          .$delete(url)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      });
    },
    get24Trans() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(url24Trans)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    get24Order() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(url24Orders)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    get24ticket() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(url24Tickets)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    get24Accs() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(url24Accs)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getAllAdmins() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(urlAllAdmins)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    addNewAdmin(data) {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$post(urlAddNewAdmin, data)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    getAllUsers() {
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(urlAllUsers)
          .then((result) => {
            resolve(result);
          })
          .catch((error) => {
            reject(app.$mhandler.check(error));
          });
      });
    },
    downloadImageOrder(imageName) {
      const url = String(urlDownloadImageOrder).replace(
        "{imageName}",
        imageName
      );
      return new Promise((resolve, reject) => {
        app.$axios
          .create({
            headers: {
              // 'Content-Type': 'application/json',
              "X-Access-Token": app.store.state.auth.token,
            },
          })
          .$get(url, {
            responseType: "arraybuffer",
          })
          .then((result) => {
            resolve(Buffer.from(result).toString("base64"));
          })
          // .then((result) => {
          //   // Buffer.from(result.data, 'binary').toString('base64')
          //   resolve(base64.encode(result.data))
          // })
          .catch((error) => {
            reject(app.$mhandler.check(error));
            console.log(error);
          });
      });
    },
  });
};
