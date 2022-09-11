export default {
  getAdmins(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .getAllAdmins(data)
        .then((result) => {
          const trans = result;
          vuexContext.commit("getsAllAdmins", trans);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
  addNewAdmin(vuexContext, data) {
    return new Promise((resolve, reject) => {
      this.$api
        .addNewAdmin(data)
        .then((result) => {
          const trans = result;
          vuexContext.commit("addNewAdmin", trans);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
  deleteAdmin(vuexContext, username) {
    return new Promise((resolve, reject) => {
      this.$api
        .deleteAdminByUsername(username)
        .then((result) => {
          const admin = result;
          vuexContext.commit("getByUserName", admin);
          resolve(result);
        })
        .catch((status) => {
          reject(status);
        });
    });
  },
};
