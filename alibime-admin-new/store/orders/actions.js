export default {
  getAllOrders(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .getOrders(data)
        .then((result) => {
          const orders = result;
          vuexContext.commit("getsAllOrders", orders);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
  getOrderbyID(vuexContext, _id) {
    return new Promise((resolve, reject) => {
      this.$api
        .getOrderbyID(_id)
        .then((result) => {
          const order = result;
          vuexContext.commit("getOrderById", order);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
  getOrderbyTrackID(vuexContext, _id) {
    return new Promise((resolve, reject) => {
      this.$api
        .getOrderbyTrackID(_id)
        .then((result) => {
          const order = result;
          vuexContext.commit("getOrderById", order);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
  changeStatus(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .orderStatusById(data)
        .then((result) => {
          const order = result;
          vuexContext.commit("getOrderById", order);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
  downloadImageOrder(vuexContext, imageName) {
    return new Promise((resolve, reject) => {
      this.$api
        .downloadImageOrder(imageName)
        .then((result) => {
          const order = result;
          vuexContext.commit("getImageOrder", order);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
          console.log(status);
        });
    });
  },
  deleteOrder(vuexContext, _id) {
    return new Promise((resolve, reject) => {
      this.$api
        .deleteOrderById(_id)
        .then((result) => {
          const order = result;
          vuexContext.commit("getOrderById", order);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
};
