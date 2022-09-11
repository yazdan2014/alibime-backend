export default {
  get24Transactions(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .get24Trans(data)
        .then(result => {
          const trans = result;
          vuexContext.commit("gets24Trans", trans);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  },
  get24Orders(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .get24Order(data)
        .then(result => {
          const orders = result;
          vuexContext.commit("gets24Ordrs", orders);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  },
  get24Tickets(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .get24ticket(data)
        .then(result => {
          const ticks = result;
          vuexContext.commit("gets24Tick", ticks);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  },
  get24Accounts(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .get24ticket(data)
        .then(result => {
          const accs = result;
          vuexContext.commit("gets24Acc", accs);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  }
};
