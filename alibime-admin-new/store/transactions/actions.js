export default {
  getAllTrans(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .getTrans(data)
        .then(result => {
          const trans = result;
          vuexContext.commit("getsAllTrans", trans);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  },
  getTransbyID(vuexContext, id) {
    return new Promise((resolve, reject) => {
      this.$api
        .getTransactionbyID(id)
        .then(result => {
          const trans = result;
          vuexContext.commit("getTransById", trans);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  },
  getTransbyTransID(vuexContext, id) {
    return new Promise((resolve, reject) => {
      this.$api
        .getTransactionbyTransID(id)
        .then(result => {
          const trans = result;
          vuexContext.commit("getTransById", trans);
          resolve(result);
        })
        .catch(status => {
          reject(status);
        });
    });
  }
};
